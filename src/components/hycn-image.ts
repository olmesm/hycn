import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface ImageProps {
	alt: string
	height: number
	loading: "eager" | "lazy"
	src: string
	width: number
}
export type Type = DefineComponent<ImageProps>
export const component: Type["Component"] = {
	tag: "hycn-image",
	alt: "",
	height: 0,
	loading: "lazy",
	src: "",
	width: 0,
	render: (host) =>
		html`<img alt="${host.alt}" height="${host.height || undefined}" loading="${host.loading}" part="image" src="${host.src}" width="${host.width || undefined}" />`.style(
			`:host { display: inline-block; } img { display: block; max-inline-size: 100%; block-size: auto; }`,
		),
}
export const register = () => registerComponent(component)
