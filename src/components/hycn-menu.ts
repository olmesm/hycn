import { html } from "hybrids"
import { clampIndex, eventElement, uniqueId } from "../utils/dom.js"
import { emit } from "../utils/events.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface MenuProps {
	label: string
	open: boolean
	setup: boolean
}

export type Type = DefineComponent<MenuProps>
type Host = Type["Props"]

const menuId = new WeakMap<Host, string>()
const itemsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLElement>(":scope > :not([slot])")).filter(
		(item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true",
	)
const triggerFor = (host: Host) => host.querySelector<HTMLElement>(":scope > [slot='trigger']")

function sync(host: Host) {
	const trigger = triggerFor(host)
	const id = menuId.get(host) ?? uniqueId("hycn-menu")
	menuId.set(host, id)
	if (trigger) {
		trigger.setAttribute("aria-controls", id)
		trigger.setAttribute("aria-expanded", String(host.open))
		trigger.setAttribute("aria-haspopup", "menu")
	}
	for (const item of itemsFor(host)) {
		item.setAttribute("role", item.getAttribute("role") ?? "menuitem")
		item.tabIndex = -1
	}
}

function setOpen(host: Host, open: boolean, focus: "first" | "last" | "trigger" | false = false) {
	host.open = open
	sync(host)
	queueMicrotask(() => {
		if (focus === "trigger") triggerFor(host)?.focus()
		else if (focus === "first") itemsFor(host)[0]?.focus()
		else if (focus === "last") itemsFor(host).at(-1)?.focus()
	})
}

function onClick(host: Host, event: Event) {
	const trigger = eventElement(event, (element) => element.slot === "trigger")
	if (trigger) {
		setOpen(host, !host.open, host.open ? "trigger" : "first")
		return
	}
	const item = eventElement(event, (element) => itemsFor(host).includes(element))
	if (!item) return
	emit(host, "hycn-select", { value: item.dataset.value ?? item.textContent?.trim() ?? "" })
	setOpen(host, false, "trigger")
}

function onKeyDown(host: Host, event: Event) {
	if (!(event instanceof KeyboardEvent)) return
	const trigger = eventElement(event, (element) => element.slot === "trigger")
	if (trigger) {
		if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
			event.preventDefault()
			setOpen(host, true, "first")
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			setOpen(host, true, "last")
		}
		return
	}

	const item = eventElement(event, (element) => itemsFor(host).includes(element))
	if (!item) return
	const items = itemsFor(host)
	const current = items.indexOf(item)
	let next = current
	if (event.key === "ArrowDown") next = clampIndex(current + 1, items.length)
	else if (event.key === "ArrowUp") next = clampIndex(current - 1, items.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = items.length - 1
	else if (event.key === "Escape" || event.key === "Tab") {
		setOpen(host, false, event.key === "Escape" ? "trigger" : false)
		return
	} else return

	event.preventDefault()
	items[next]?.focus()
}

export const component: Type["Component"] = {
	tag: "hycn-menu",
	label: "Menu",
	open: {
		value: false,
		reflect: true,
		observe: (host) => queueMicrotask(() => sync(host)),
	},
	setup: {
		value: false,
		connect(host) {
			const click = onClick.bind(null, host)
			const keydown = onKeyDown.bind(null, host)
			const outside = (event: PointerEvent) => {
				if (host.open && !event.composedPath().includes(host)) setOpen(host, false)
			}
			host.addEventListener("click", click)
			host.addEventListener("keydown", keydown)
			document.addEventListener("pointerdown", outside, true)
			queueMicrotask(() => sync(host))
			return () => {
				host.removeEventListener("click", click)
				host.removeEventListener("keydown", keydown)
				document.removeEventListener("pointerdown", outside, true)
			}
		},
	},
	render: (host) => {
		const { label, open } = host
		const id = menuId.get(host) ?? uniqueId("hycn-menu")
		menuId.set(host, id)
		return html`
			<slot name="trigger"></slot>
			<div aria-label="${label}" hidden="${!open}" id="${id}" part="menu" role="menu">
				<slot></slot>
			</div>
		`.style(`
			:host { display: inline-block; position: relative; }
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
			[part="menu"][hidden] { display: none; }
			::slotted(:not([slot])) { display: block; inline-size: 100%; }
		`)
	},
}

export const register = () => registerComponent(component)
