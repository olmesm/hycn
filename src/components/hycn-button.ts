import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface ButtonProps {
	disabled: boolean
	type: "button" | "reset" | "submit"
}
export type Type = DefineComponent<ButtonProps>
export const component: Type["Component"] = {
	tag: "hycn-button",
	disabled: { value: false, reflect: true },
	type: "button",
	render: (host) =>
		html`<button disabled="${host.disabled}" part="base" type="${host.type}"><slot></slot></button>`,
}
export const register = () => registerComponent(component)
