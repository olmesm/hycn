import { dispatch, html } from "hybrids"
import { clampIndex, eventElement, uniqueId } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface TabsProps {
	activation: "automatic" | "manual"
	orientation: "horizontal" | "vertical"
	selectedIndex: number
}

export type Type = DefineComponent<TabsProps>
type Host = Type["Props"]

const tabsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > [slot='tab']"))
const panelsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > [slot='panel']"))
const managedAriaDisabled = new WeakSet<HTMLElement>()
const hasNativeDisabledState = (tab: HTMLElement) =>
	(tab instanceof HTMLButtonElement && tab.disabled) || tab.hasAttribute("disabled")
const isDisabled = (tab: HTMLElement) =>
	hasNativeDisabledState(tab) || tab.getAttribute("aria-disabled") === "true"
const enabledTabsFor = (host: Host) => tabsFor(host).filter((tab) => !isDisabled(tab))

function normalizedIndex(host: Host, tabs: HTMLElement[]) {
	if (tabs.length === 0) return -1
	const bounded = Math.max(0, Math.min(host.selectedIndex, tabs.length - 1))
	const boundedTab = tabs[bounded]
	if (boundedTab && !isDisabled(boundedTab)) return bounded
	const next = tabs.findIndex((tab, index) => index >= bounded && !isDisabled(tab))
	if (next >= 0) return next
	return tabs.findIndex((tab) => !isDisabled(tab))
}

function sync(host: Host) {
	const tabs = tabsFor(host)
	const panels = panelsFor(host)
	const selectedIndex = normalizedIndex(host, tabs)
	if (selectedIndex >= 0 && selectedIndex !== host.selectedIndex) host.selectedIndex = selectedIndex

	tabs.forEach((tab, index) => {
		const panel = panels[index]
		const nativeDisabled = hasNativeDisabledState(tab)
		if (nativeDisabled && tab.getAttribute("aria-disabled") !== "true") {
			managedAriaDisabled.add(tab)
			tab.setAttribute("aria-disabled", "true")
		} else if (!nativeDisabled && managedAriaDisabled.has(tab)) {
			managedAriaDisabled.delete(tab)
			tab.removeAttribute("aria-disabled")
		}
		const disabled = isDisabled(tab)
		tab.id ||= uniqueId("hycn-tab")
		tab.setAttribute("role", "tab")
		tab.setAttribute("aria-selected", String(index === selectedIndex))
		tab.tabIndex = index === selectedIndex && !disabled ? 0 : -1

		if (panel) {
			panel.id ||= uniqueId("hycn-panel")
			tab.setAttribute("aria-controls", panel.id)
			panel.setAttribute("aria-labelledby", tab.id)
			panel.setAttribute("role", "tabpanel")
			panel.tabIndex = 0
			panel.hidden = index !== selectedIndex
		} else {
			tab.removeAttribute("aria-controls")
		}
	})

	for (const panel of panels.slice(tabs.length)) {
		panel.setAttribute("role", "tabpanel")
		panel.hidden = true
	}
}

function select(host: Host, tab: HTMLElement, notify = true) {
	if (isDisabled(tab)) return
	const index = tabsFor(host).indexOf(tab)
	if (index < 0) return
	const changed = index !== host.selectedIndex
	host.selectedIndex = index
	sync(host)
	if (changed && notify) {
		dispatch(host, "hycn-change", {
			bubbles: true,
			composed: true,
			detail: { index },
		})
	}
}

function onClick(host: Host, event: Event) {
	const tab = eventElement(event, (element) => element.slot === "tab")
	if (tab) select(host, tab)
}

function onKeyDown(host: Host, event: KeyboardEvent) {
	const tab = eventElement(event, (element) => element.slot === "tab")
	if (!tab || isDisabled(tab)) return
	const enabled = enabledTabsFor(host)
	const current = enabled.indexOf(tab)
	const previousKey = host.orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
	const nextKey = host.orientation === "vertical" ? "ArrowDown" : "ArrowRight"
	let next = current

	if (event.key === previousKey) next = clampIndex(current - 1, enabled.length)
	else if (event.key === nextKey) next = clampIndex(current + 1, enabled.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = enabled.length - 1
	else if ((event.key === "Enter" || event.key === " ") && host.activation === "manual") {
		event.preventDefault()
		select(host, tab)
		return
	} else return

	event.preventDefault()
	const nextTab = enabled[next]
	nextTab?.focus()
	if (nextTab && host.activation === "automatic") select(host, nextTab)
}

function onSlotChange(host: Host) {
	sync(host)
}

export const component: Type["Component"] = {
	tag: "hycn-tabs",
	activation: { value: "automatic", reflect: true },
	orientation: {
		value: "horizontal",
		reflect: true,
		observe: sync,
	},
	selectedIndex: {
		value: 0,
		reflect: true,
		observe: sync,
	},
	render: {
		connect(host) {
			const observer = new MutationObserver(() => sync(host))
			observer.observe(host, {
				attributeFilter: ["aria-disabled", "disabled"],
				attributes: true,
				subtree: true,
			})
			return () => observer.disconnect()
		},
		value: ({ orientation }) => html`
			<div aria-orientation="${orientation}" part="tablist" role="tablist">
				<slot
					name="tab"
					onclick="${onClick}"
					onkeydown="${onKeyDown}"
					onslotchange="${onSlotChange}"
				></slot>
			</div>
			<div part="panels"><slot name="panel" onslotchange="${onSlotChange}"></slot></div>
		`,
	},
}

export const register = () => registerComponent(component)
