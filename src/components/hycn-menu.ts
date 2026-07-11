import { dispatch, html } from "hybrids"
import { clampIndex, eventElement } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface MenuProps {
	label: string
	open: boolean
}

interface MenuState extends MenuProps {
	render: () => ShadowRoot
}

export type Type = DefineComponent<MenuProps, MenuState>
type Host = Type["Props"]

const defaultChildrenFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > :not([slot]), :scope > [slot='']"))
const itemRole = (item: HTMLElement) =>
	item.getAttribute("role") ?? (item instanceof HTMLHRElement ? "separator" : "menuitem")
const isMenuItem = (item: HTMLElement) =>
	["menuitem", "menuitemcheckbox", "menuitemradio"].includes(itemRole(item))
const isDisabled = (item: HTMLElement) =>
	(item instanceof HTMLButtonElement && item.disabled) ||
	item.hasAttribute("disabled") ||
	item.getAttribute("aria-disabled") === "true"
const enabledItemsFor = (host: Host) =>
	defaultChildrenFor(host).filter((item) => isMenuItem(item) && !isDisabled(item))
const triggerFor = (host: Host) => host.querySelector<HTMLElement>(":scope > [slot='trigger']")

function sync(host: Host) {
	const trigger = triggerFor(host)
	if (trigger) {
		trigger.setAttribute("aria-expanded", String(host.open))
		trigger.setAttribute("aria-haspopup", "menu")
	}
	for (const item of defaultChildrenFor(host)) {
		if (!item.hasAttribute("role") && itemRole(item) === "menuitem")
			item.setAttribute("role", "menuitem")
		if (isMenuItem(item)) item.setAttribute("aria-disabled", String(isDisabled(item)))
		item.tabIndex = -1
	}
}

function setOpen(host: Host, open: boolean, focus: "first" | "last" | "trigger" | false = false) {
	host.open = open
	host.render()
	sync(host)
	if (focus === "trigger") triggerFor(host)?.focus()
	else if (focus === "first") enabledItemsFor(host)[0]?.focus()
	else if (focus === "last") enabledItemsFor(host).at(-1)?.focus()
}

function select(host: Host, item: HTMLElement) {
	if (isDisabled(item)) return
	dispatch(host, "hycn-select", {
		bubbles: true,
		composed: true,
		detail: { value: item.dataset.value ?? item.textContent?.trim() ?? "" },
	})
	setOpen(host, false, "trigger")
}

function onTriggerClick(host: Host, event: Event) {
	const trigger = eventElement(event, (element) => element.slot === "trigger")
	if (trigger) setOpen(host, !host.open, host.open ? "trigger" : "first")
}

function onTriggerKeyDown(host: Host, event: KeyboardEvent) {
	if (!eventElement(event, (element) => element.slot === "trigger")) return
	if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
		event.preventDefault()
		setOpen(host, true, "first")
	} else if (event.key === "ArrowUp") {
		event.preventDefault()
		setOpen(host, true, "last")
	}
}

function onItemClick(host: Host, event: Event) {
	const items = enabledItemsFor(host)
	const item = eventElement(event, (element) => items.includes(element))
	if (item) select(host, item)
}

function onItemKeyDown(host: Host, event: KeyboardEvent) {
	const items = enabledItemsFor(host)
	const item = eventElement(event, (element) => items.includes(element))
	if (!item) return
	const current = items.indexOf(item)
	let next = current
	if (event.key === "ArrowDown") next = clampIndex(current + 1, items.length)
	else if (event.key === "ArrowUp") next = clampIndex(current - 1, items.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = items.length - 1
	else if (event.key === "Escape") {
		event.preventDefault()
		setOpen(host, false, "trigger")
		return
	} else if (event.key === "Tab") {
		setOpen(host, false)
		return
	} else if (event.key === "Enter" || event.key === " ") {
		event.preventDefault()
		select(host, item)
		return
	} else return

	event.preventDefault()
	items[next]?.focus()
}

function onFocusOut(host: Host, event: FocusEvent) {
	if (event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) return
	setOpen(host, false)
}

function onBackdropClick(host: Host) {
	setOpen(host, false, "trigger")
}

function onSlotChange(host: Host) {
	sync(host)
}

export const component: Type["Component"] = {
	tag: "hycn-menu",
	label: "Menu",
	open: {
		value: false,
		reflect: true,
		observe: sync,
	},
	render: (host) =>
		html`
		<span part="trigger">
			<slot
				name="trigger"
				onclick="${onTriggerClick}"
				onkeydown="${onTriggerKeyDown}"
				onslotchange="${onSlotChange}"
			></slot>
		</span>
		<div hidden="${!host.open}" onclick="${onBackdropClick}" part="backdrop"></div>
		<div
			aria-label="${host.label}"
			hidden="${!host.open}"
			onfocusout="${onFocusOut}"
			part="menu"
			role="menu"
		>
			<slot
				onclick="${onItemClick}"
				onkeydown="${onItemKeyDown}"
				onslotchange="${onSlotChange}"
			></slot>
		</div>
	`.style(`
		:host { display: inline-block; position: relative; }
		[part="trigger"] { position: relative; z-index: 101; }
		[part="backdrop"] { inset: 0; position: fixed; z-index: 99; }
		[part="backdrop"][hidden], [part="menu"][hidden] { display: none; }
		[part="menu"] {
			background: var(--hycn-menu-background, Canvas);
			border: 1px solid var(--hycn-menu-border, color-mix(in srgb, CanvasText 20%, transparent));
			border-radius: var(--hycn-menu-radius, .5rem);
			box-shadow: 0 .75rem 2rem rgb(0 0 0 / 18%);
			inset-block-start: calc(100% + .25rem);
			min-inline-size: 10rem;
			padding: .25rem;
			position: absolute;
			z-index: var(--hycn-menu-z-index, 100);
		}
		::slotted(*) { display: block; inline-size: 100%; }
	`),
}

export const register = () => registerComponent(component)
