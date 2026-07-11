import { html } from "hybrids"
import { clampIndex, eventElement, uniqueId } from "../utils/dom.js"
import { emit } from "../utils/events.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface TabsProps {
	activation: "automatic" | "manual"
	orientation: "horizontal" | "vertical"
	selectedIndex: number
	setup: boolean
}

export type Type = DefineComponent<TabsProps>
type Host = Type["Props"]

const tabsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > [slot='tab']")).filter(
		(tab) => !tab.hasAttribute("disabled"),
	)
const panelsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > [slot='panel']"))

function sync(host: Host) {
	const tabs = tabsFor(host)
	const panels = panelsFor(host)
	if (tabs.length === 0) return
	host.selectedIndex = Math.max(0, Math.min(host.selectedIndex, tabs.length - 1))

	tabs.forEach((tab, index) => {
		const panel = panels[index]
		tab.id ||= uniqueId("hycn-tab")
		tab.setAttribute("role", "tab")
		tab.setAttribute("aria-selected", String(index === host.selectedIndex))
		tab.tabIndex = index === host.selectedIndex ? 0 : -1
		if (panel) {
			panel.id ||= uniqueId("hycn-panel")
			tab.setAttribute("aria-controls", panel.id)
			panel.setAttribute("aria-labelledby", tab.id)
			panel.setAttribute("role", "tabpanel")
			panel.tabIndex = 0
			panel.hidden = index !== host.selectedIndex
		}
	})
}

function select(host: Host, index: number, notify = true) {
	const tabs = tabsFor(host)
	const next = clampIndex(index, tabs.length)
	if (next < 0) return
	const changed = next !== host.selectedIndex
	host.selectedIndex = next
	sync(host)
	if (changed && notify) emit(host, "hycn-change", { index: next })
}

function onClick(host: Host, event: Event) {
	const tab = eventElement(event, (element) => element.slot === "tab")
	if (!tab || tab.hasAttribute("disabled")) return
	select(host, tabsFor(host).indexOf(tab))
}

function onKeyDown(host: Host, event: Event) {
	if (!(event instanceof KeyboardEvent)) return
	const tab = eventElement(event, (element) => element.slot === "tab")
	if (!tab) return
	const tabs = tabsFor(host)
	const current = tabs.indexOf(tab)
	const previousKey = host.orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
	const nextKey = host.orientation === "vertical" ? "ArrowDown" : "ArrowRight"
	let next = current

	if (event.key === previousKey) next = clampIndex(current - 1, tabs.length)
	else if (event.key === nextKey) next = clampIndex(current + 1, tabs.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = tabs.length - 1
	else if ((event.key === "Enter" || event.key === " ") && host.activation === "manual") {
		event.preventDefault()
		select(host, current)
		return
	} else return

	event.preventDefault()
	tabs[next]?.focus()
	if (host.activation === "automatic") select(host, next)
}

function onSlotChange(host: Host) {
	queueMicrotask(() => sync(host))
}

export const component: Type["Component"] = {
	tag: "hycn-tabs",
	activation: "automatic",
	orientation: {
		value: "horizontal",
		reflect: true,
		observe: (host) => queueMicrotask(() => sync(host)),
	},
	selectedIndex: {
		value: 0,
		reflect: true,
		observe: (host) => queueMicrotask(() => sync(host)),
	},
	setup: {
		value: false,
		connect(host) {
			const click = onClick.bind(null, host)
			const keydown = onKeyDown.bind(null, host)
			host.addEventListener("click", click)
			host.addEventListener("keydown", keydown)
			queueMicrotask(() => sync(host))
			return () => {
				host.removeEventListener("click", click)
				host.removeEventListener("keydown", keydown)
			}
		},
	},
	render: ({ orientation }) => html`
		<div aria-orientation="${orientation}" part="tablist" role="tablist">
			<slot name="tab" onslotchange="${onSlotChange}"></slot>
		</div>
		<div part="panels"><slot name="panel" onslotchange="${onSlotChange}"></slot></div>
	`,
}

export const register = () => registerComponent(component)
