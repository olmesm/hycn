import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export type Type = DefineComponent<object>
export const component: Type["Component"] = {
	tag: "hycn-badge",
	render: () =>
		html`<span part="base"><slot></slot></span>`.style(
			`:host { display: inline-flex; } [part="base"] { border-radius: 999px; padding: .125rem .5rem; background: color-mix(in srgb, CanvasText 12%, Canvas); }`,
		),
}
export const register = () => registerComponent(component)
