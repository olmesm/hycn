import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface AvatarProps {
	alt: string
	initials: string
	src: string
}
export type Type = DefineComponent<AvatarProps>
export const component: Type["Component"] = {
	tag: "hycn-avatar",
	alt: "",
	initials: "",
	src: "",
	render: (host) =>
		html`<span aria-label="${host.alt || undefined}" part="base" role="${host.alt ? "img" : undefined}">${host.src ? html`<img alt="${host.alt}" part="image" src="${host.src}" />` : html`<span aria-hidden="${Boolean(host.alt)}" part="fallback">${host.initials}<slot></slot></span>`}</span>`.style(
			`:host { display: inline-flex; } [part="base"], img { border-radius: 50%; inline-size: 2.5rem; block-size: 2.5rem; object-fit: cover; display: grid; place-items: center; }`,
		),
}
export const register = () => registerComponent(component)
