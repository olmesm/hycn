import { html } from "hybrids"
import { uniqueId } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface TooltipProps {
	delay: number
	open: boolean
}
interface TooltipState extends TooltipProps {
	tooltipId: string
}
export type Type = DefineComponent<TooltipProps, TooltipState>
type Host = Type["Props"]
const timers = new WeakMap<Host, ReturnType<typeof setTimeout>>()
const triggerFor = (host: Host) => host.querySelector<HTMLElement>(":scope > [slot='trigger']")
function sync(host: Host) {
	triggerFor(host)?.setAttribute("aria-describedby", host.tooltipId)
}
function schedule(host: Host, open: boolean) {
	clearTimeout(timers.get(host))
	if (!open) host.open = false
	else
		timers.set(
			host,
			setTimeout(() => {
				host.open = true
			}, host.delay),
		)
}
export const component: Type["Component"] = {
	tag: "hycn-tooltip",
	delay: 300,
	open: { value: false, reflect: true },
	tooltipId: () => uniqueId("hycn-tooltip"),
	render: (host) =>
		html`
		<span onfocusin="${(host: Host) => schedule(host, true)}" onfocusout="${(host: Host) => schedule(host, false)}" onmouseenter="${(host: Host) => schedule(host, true)}" onmouseleave="${(host: Host) => schedule(host, false)}" part="trigger"><slot name="trigger" onslotchange="${sync}"></slot></span>
		<div hidden="${!host.open}" id="${host.tooltipId}" part="tooltip" role="tooltip"><slot></slot></div>
	`.style(
			`:host { display: inline-block; position: relative; } [hidden] { display: none; } [part="tooltip"] { background: var(--hycn-tooltip-background, CanvasText); color: var(--hycn-tooltip-color, Canvas); inset-block-end: calc(100% + .25rem); padding: .25rem .5rem; position: absolute; white-space: nowrap; }`,
		),
}
export const register = () => registerComponent(component)
