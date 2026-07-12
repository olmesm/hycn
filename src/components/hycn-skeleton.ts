import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"
export interface SkeletonProps {
	label: string
}
export type Type = DefineComponent<SkeletonProps>
export const component: Type["Component"] = {
	tag: "hycn-skeleton",
	label: "Loading",
	render: (host) =>
		html`<span aria-label="${host.label}" part="base" role="status"></span>`.style(
			`:host { display: block; } [part="base"] { display: block; min-block-size: 1rem; border-radius: .25rem; background: color-mix(in srgb, CanvasText 12%, Canvas); animation: pulse 1.5s ease-in-out infinite; } @keyframes pulse { 50% { opacity: .45; } } @media (prefers-reduced-motion: reduce) { [part="base"] { animation: none; } }`,
		),
}
export const register = () => registerComponent(component)
