import { dispatch, html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface DisclosureProps {
	disabled: boolean
	label: string
	open: boolean
}
export type Type = DefineComponent<DisclosureProps>
type Host = Type["Props"]

function toggle(host: Host) {
	if (host.disabled) return
	host.open = !host.open
	dispatch(host, "hycn-toggle", { bubbles: true, composed: true, detail: { expanded: host.open } })
}

export const component: Type["Component"] = {
	tag: "hycn-disclosure",
	disabled: { value: false, reflect: true },
	label: "Details",
	open: { value: false, reflect: true },
	render: (host) =>
		html`
		<button aria-expanded="${host.open}" disabled="${host.disabled}" onclick="${toggle}" part="trigger" type="button">
			<slot name="trigger">${host.label}</slot>
		</button>
		<div hidden="${!host.open}" part="panel"><slot></slot></div>
	`.style(`:host { display: block; } [part="panel"][hidden] { display: none; }`),
}
export const register = () => registerComponent(component)
