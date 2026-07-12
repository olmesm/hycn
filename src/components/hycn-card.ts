import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export type Type = DefineComponent<object>
export const component: Type["Component"] = {
	tag: "hycn-card",
	render: () =>
		html`<article part="base"><slot></slot></article>`.style(
			`:host { display: block; } [part="base"] { border: 1px solid color-mix(in srgb, CanvasText 20%, transparent); border-radius: .5rem; padding: 1rem; }`,
		),
}
export const register = () => registerComponent(component)
