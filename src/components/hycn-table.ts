import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface TableProps {
	label: string
}
export type Type = DefineComponent<TableProps>
export const component: Type["Component"] = {
	tag: "hycn-table",
	label: "",
	render: (host) =>
		html`<div aria-label="${host.label || undefined}" part="base" role="region" tabindex="0"><slot></slot></div>`.style(
			`:host { display: block; } [part="base"] { overflow: auto; }`,
		),
}
export const register = () => registerComponent(component)
