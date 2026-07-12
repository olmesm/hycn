import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface IconProps {
	label: string
}
export type Type = DefineComponent<IconProps>
export const component: Type["Component"] = {
	tag: "hycn-icon",
	label: "",
	render: (host) =>
		html`<span aria-hidden="${!host.label}" aria-label="${host.label || undefined}" part="base" role="${host.label ? "img" : undefined}"><slot></slot></span>`.style(
			`:host { display: inline-flex; line-height: 1; }`,
		),
}
export const register = () => registerComponent(component)
