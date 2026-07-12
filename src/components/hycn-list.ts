import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface ListProps {
	ordered: boolean
}
export type Type = DefineComponent<ListProps>
export const component: Type["Component"] = {
	tag: "hycn-list",
	ordered: { value: false, reflect: true },
	render: (host) =>
		host.ordered
			? html`<ol part="base"><slot></slot></ol>`
			: html`<ul part="base"><slot></slot></ul>`,
}
export const register = () => registerComponent(component)
