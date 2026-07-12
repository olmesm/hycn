import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface FlexProps {
	align: string
	direction: "column" | "row"
	gap: string
	justify: string
	wrap: boolean
}
export type Type = DefineComponent<FlexProps>
export const component: Type["Component"] = {
	tag: "hycn-flex",
	align: "stretch",
	direction: "row",
	gap: "0",
	justify: "normal",
	wrap: { value: false, reflect: true },
	render: (host) =>
		html`<div part="base" style="align-items:${host.align};display:flex;flex-direction:${host.direction};flex-wrap:${host.wrap ? "wrap" : "nowrap"};gap:${host.gap};justify-content:${host.justify}"><slot></slot></div>`,
}
export const register = () => registerComponent(component)
