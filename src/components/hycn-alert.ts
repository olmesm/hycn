import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface AlertProps {
	tone: "assertive" | "polite"
}
export type Type = DefineComponent<AlertProps>
export const component: Type["Component"] = {
	tag: "hycn-alert",
	tone: "polite",
	render: (host) =>
		html`<div aria-live="${host.tone}" part="base" role="alert"><slot></slot></div>`,
}
export const register = () => registerComponent(component)
