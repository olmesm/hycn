import { html } from "hybrids"
import { clampIndex, eventElement } from "../utils/dom.js"
import { emit } from "../utils/events.js"
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
	activeId: string
	expanded: string[]
	items: TreeItem[]
	label: string
	selectedId: string
}

export type Type = DefineComponent<TreeProps>
type Host = Type["Props"]

function visibleItems(items: TreeItem[], expanded: string[], level = 1, parentId?: string) {
	const result: VisibleTreeItem[] = []
	items.forEach((item, index) => {
		result.push({ ...item, level, parentId, position: index + 1, setSize: items.length })
		if (item.children?.length && expanded.includes(item.id)) {
			result.push(...visibleItems(item.children, expanded, level + 1, item.id))
		}
	})
	return result
}

function focusItem(host: Host, id: string) {
	host.activeId = id
	queueMicrotask(() => {
		host.shadowRoot?.querySelector<HTMLElement>(`[data-tree-id="${CSS.escape(id)}"]`)?.focus()
	})
}

function toggle(host: Host, id: string, force?: boolean) {
	const open = host.expanded.includes(id)
	const nextOpen = force ?? !open
	host.expanded = nextOpen
		? [...host.expanded.filter((value) => value !== id), id]
		: host.expanded.filter((value) => value !== id)
	emit(host, "hycn-toggle", { expanded: nextOpen, id })
}

function select(host: Host, item: TreeItem) {
	if (item.disabled) return
	host.selectedId = item.id
	host.activeId = item.id
	emit(host, "hycn-change", { id: item.id, label: item.label })
}

function onClick(host: Host, event?: Event) {
	if (!event) return
	const row = eventElement(event, (element) => element.dataset.treeId !== undefined)
	if (!row) return
	const id = row.dataset.treeId ?? ""
	const item = visibleItems(host.items, host.expanded).find((entry) => entry.id === id)
	if (!item) return
	if (eventElement(event, (element) => element.dataset.toggle !== undefined)) toggle(host, id)
	else select(host, item)
}

function onKeyDown(host: Host, event?: Event) {
	if (!(event instanceof KeyboardEvent)) return
	const row = eventElement(event, (element) => element.dataset.treeId !== undefined)
	if (!row) return
	const items = visibleItems(host.items, host.expanded)
	const current = items.findIndex((item) => item.id === row.dataset.treeId)
	const item = items[current]
	if (!item) return
	let next = current
	if (event.key === "ArrowDown") next = clampIndex(current + 1, items.length)
	else if (event.key === "ArrowUp") next = clampIndex(current - 1, items.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = items.length - 1
	else if (event.key === "ArrowRight") {
		if (item.children?.length && !host.expanded.includes(item.id)) toggle(host, item.id, true)
		else if (item.children?.length) focusItem(host, item.children[0]?.id ?? item.id)
		return
	} else if (event.key === "ArrowLeft") {
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
	activeId: "",
	expanded: { value: [] as string[] },
	items: { value: [] as TreeItem[] },
	label: "Tree",
	selectedId: { value: "", reflect: true },
	render: (host) => {
		const items = visibleItems(host.items, host.expanded)
		const activeId = host.activeId || items[0]?.id || ""
		return html`
			<div aria-label="${host.label}" onkeydown="${onKeyDown}" part="tree" role="tree">
				${items.map((item) =>
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
