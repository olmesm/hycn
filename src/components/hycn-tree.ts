import { dispatch, html } from "hybrids"
import { clampIndex, eventElement } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface TreeItem {
	children?: TreeItem[]
	disabled?: boolean
	id: string
	label: string
}

interface VisibleTreeItem extends TreeItem {
	level: number
	parentId?: string
	position: number
	setSize: number
}

export interface TreeProps {
	expanded: string[]
	items: TreeItem[]
	label: string
	selectedId: string
}

interface TreeState extends TreeProps {
	activeElement: HTMLElement | null
	activeId: string
	render: () => ShadowRoot
	visibleItems: VisibleTreeItem[]
}

export type Type = DefineComponent<TreeProps, TreeState>
type Host = Type["Props"]

function flatten(items: TreeItem[], expanded: string[], level = 1, parentId?: string) {
	const result: VisibleTreeItem[] = []
	items.forEach((item, index) => {
		result.push({ ...item, level, parentId, position: index + 1, setSize: items.length })
		if (item.children?.length && expanded.includes(item.id)) {
			result.push(...flatten(item.children, expanded, level + 1, item.id))
		}
	})
	return result
}

function findPath(items: TreeItem[], id: string, ancestors: string[] = []): string[] | undefined {
	for (const item of items) {
		const path = [...ancestors, item.id]
		if (item.id === id) return path
		const nested = item.children && findPath(item.children, id, path)
		if (nested) return nested
	}
	return undefined
}

function resolvedActiveId(host: Host, visible = host.visibleItems) {
	if (visible.some((item) => item.id === host.activeId)) return host.activeId
	const visibleIds = new Set(visible.map((item) => item.id))
	const ancestor = findPath(host.items, host.activeId)
		?.reverse()
		.find((id) => visibleIds.has(id))
	return ancestor ?? visible.find((item) => !item.disabled)?.id ?? visible[0]?.id ?? ""
}

function normalizeActive(host: Host, visible: VisibleTreeItem[]) {
	const activeId = resolvedActiveId(host, visible)
	if (activeId !== host.activeId) host.activeId = activeId
}

function focusItem(host: Host, id: string) {
	host.activeId = id
	host.render()
	host.activeElement?.focus()
}

function toggle(host: Host, id: string, force?: boolean) {
	const open = host.expanded.includes(id)
	const nextOpen = force ?? !open
	if (!nextOpen) {
		const activePath = findPath(host.items, host.activeId)
		if (activePath?.includes(id) && host.activeId !== id) host.activeId = id
	}
	host.expanded = nextOpen
		? [...host.expanded.filter((value) => value !== id), id]
		: host.expanded.filter((value) => value !== id)
	dispatch(host, "hycn-toggle", {
		bubbles: true,
		composed: true,
		detail: { expanded: nextOpen, id },
	})
}

function select(host: Host, item: TreeItem) {
	if (item.disabled) return
	host.selectedId = item.id
	host.activeId = item.id
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { id: item.id, label: item.label },
	})
}

function onClick(host: Host, event: Event) {
	const row = eventElement(event, (element) => element.dataset.treeId !== undefined)
	if (!row) return
	const id = row.dataset.treeId ?? ""
	const item = host.visibleItems.find((entry) => entry.id === id)
	if (!item) return
	if (eventElement(event, (element) => element.dataset.toggle !== undefined)) toggle(host, id)
	else select(host, item)
}

function onKeyDown(host: Host, event: KeyboardEvent) {
	const row = eventElement(event, (element) => element.dataset.treeId !== undefined)
	if (!row) return
	const items = host.visibleItems
	const current = items.findIndex((item) => item.id === row.dataset.treeId)
	const item = items[current]
	if (!item) return
	let next = current
	if (event.key === "ArrowDown") next = clampIndex(current + 1, items.length)
	else if (event.key === "ArrowUp") next = clampIndex(current - 1, items.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = items.length - 1
	else if (event.key === "ArrowRight") {
		event.preventDefault()
		if (item.children?.length && !host.expanded.includes(item.id)) toggle(host, item.id, true)
		else if (item.children?.length) focusItem(host, item.children[0]?.id ?? item.id)
		return
	} else if (event.key === "ArrowLeft") {
		event.preventDefault()
		if (item.children?.length && host.expanded.includes(item.id)) toggle(host, item.id, false)
		else if (item.parentId) focusItem(host, item.parentId)
		return
	} else if (event.key === "Enter" || event.key === " ") {
		event.preventDefault()
		select(host, item)
		return
	} else return

	event.preventDefault()
	focusItem(host, items[next]?.id ?? item.id)
}

export const component: Type["Component"] = {
	tag: "hycn-tree",
	activeElement: ({ activeId, render }) =>
		render().querySelector<HTMLElement>(`[data-tree-id="${CSS.escape(activeId)}"]`),
	activeId: "",
	expanded: { value: [] as string[] },
	items: { value: [] as TreeItem[] },
	label: "Tree",
	selectedId: { value: "", reflect: true },
	visibleItems: {
		value: ({ expanded, items }) => flatten(items, expanded),
		observe: normalizeActive,
	},
	render: (host) => {
		const activeId = resolvedActiveId(host)
		return html`
			<div aria-label="${host.label}" onkeydown="${onKeyDown}" part="tree" role="tree">
				${host.visibleItems.map((item) =>
					html`
						<div
							aria-disabled="${item.disabled ? "true" : undefined}"
							aria-expanded="${item.children?.length ? String(host.expanded.includes(item.id)) : undefined}"
							aria-level="${item.level}"
							aria-posinset="${item.position}"
							aria-selected="${String(host.selectedId === item.id)}"
							aria-setsize="${item.setSize}"
							data-tree-id="${item.id}"
							onclick="${onClick}"
							part="item"
							role="treeitem"
							style="${{ paddingInlineStart: `${(item.level - 1) * 1 + 0.5}rem` }}"
							tabindex="${activeId === item.id ? 0 : -1}"
						>
							${
								item.children?.length
									? html`<button
									aria-label="${host.expanded.includes(item.id) ? "Collapse" : "Expand"} ${item.label}"
									data-toggle
									part="toggle"
									tabindex="-1"
								>${host.expanded.includes(item.id) ? "−" : "+"}</button>`
									: html`<span part="spacer"></span>`
							}
							<span part="label">${item.label}</span>
						</div>
					`.key(item.id),
				)}
			</div>
		`.style(`
			:host { display: block; }
			[part="item"] { align-items: center; display: flex; gap: .35rem; padding-block: .35rem; padding-inline-end: .5rem; }
			[part="item"]:focus { outline: 2px solid Highlight; outline-offset: -2px; }
			[part="item"][aria-selected="true"] { background: color-mix(in srgb, Highlight 18%, transparent); }
			[part="item"][aria-disabled="true"] { opacity: .5; }
			[part="toggle"] { inline-size: 1.5rem; }
			[part="spacer"] { inline-size: 1.5rem; }
		`)
	},
}

export const register = () => registerComponent(component)
