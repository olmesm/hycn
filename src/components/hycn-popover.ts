import { dispatch, html } from "hybrids"
import { uniqueId } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface PopoverProps {
	label: string
	open: boolean
}
interface PopoverState extends PopoverProps {
	popupId: string
}
export type Type = DefineComponent<PopoverProps, PopoverState>
type Host = Type["Props"]
const triggerFor = (host: Host) => host.querySelector<HTMLElement>(":scope > [slot='trigger']")
function setOpen(host: Host, open: boolean) {
	if (host.open === open) return
	host.open = open
	dispatch(host, "hycn-toggle", { bubbles: true, composed: true, detail: { open } })
}
function sync(host: Host) {
	const trigger = triggerFor(host)
	trigger?.setAttribute("aria-expanded", String(host.open))
	trigger?.setAttribute("aria-controls", host.popupId)
	trigger?.setAttribute("aria-haspopup", "dialog")
}
export const component: Type["Component"] = {
	tag: "hycn-popover",
	label: "Popover",
	open: { value: false, reflect: true, observe: sync },
	popupId: () => uniqueId("hycn-popover"),
	render: (host) =>
		html`
		<span onclick="${(host: Host) => setOpen(host, !host.open)}" part="trigger"><slot name="trigger" onslotchange="${sync}"></slot></span>
		<div hidden="${!host.open}" onclick="${(host: Host) => setOpen(host, false)}" part="backdrop"></div>
		<section aria-label="${host.label}" hidden="${!host.open}" id="${host.popupId}" onkeydown="${(
			host: Host,
			event: KeyboardEvent,
		) => {
			if (event.key === "Escape") {
				event.preventDefault()
				setOpen(host, false)
				triggerFor(host)?.focus()
			}
		}}" part="popup" role="dialog" tabindex="-1"><slot></slot></section>
	`.style(`
		:host { display: inline-block; position: relative; }
		[hidden] { display: none; }
		[part="backdrop"] { inset: 0; position: fixed; z-index: 99; }
		[part="popup"] { background: var(--hycn-popover-background, Canvas); border: 1px solid var(--hycn-popover-border, color-mix(in srgb, CanvasText 20%, transparent)); inset-block-start: calc(100% + .25rem); padding: .75rem; position: absolute; z-index: 100; }
	`),
}
export const register = () => registerComponent(component)
