import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface TextProps {
	muted: boolean
	weight: "bold" | "normal"
}
export type Type = DefineComponent<TextProps>
export const component: Type["Component"] = {
	tag: "hycn-text",
	muted: { value: false, reflect: true },
	weight: "normal",
	render: (host) =>
		html`<span part="base" style="color:${host.muted ? "GrayText" : "inherit"};font-weight:${host.weight}"><slot></slot></span>`,
}
export const register = () => registerComponent(component)
