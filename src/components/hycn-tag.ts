import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export type Type = DefineComponent<object>
export const component: Type["Component"] = {
	tag: "hycn-tag",
	render: () =>
		html`<span part="base"><slot></slot></span>`.style(
			`:host { display: inline-flex; } [part="base"] { border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: .25rem; padding: .125rem .5rem; }`,
		),
}
export const register = () => registerComponent(component)
