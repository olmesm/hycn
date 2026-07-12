import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface BreadcrumbProps {
	label: string
}
export type Type = DefineComponent<BreadcrumbProps>
export const component: Type["Component"] = {
	tag: "hycn-breadcrumb",
	label: "Breadcrumb",
	render: (host) => html`<nav aria-label="${host.label}" part="base"><slot></slot></nav>`,
}
export const register = () => registerComponent(component)
