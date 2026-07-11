import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export type Type = DefineComponent<{
	count: number
}>

export function increaseCount(host: Type["Props"]) {
	host.count += 1
}

export const component: Type["Component"] = {
	tag: "simple-counter",
	count: 0,
	render: ({ count }) => html`
    <button onclick="${increaseCount}">Count: ${count}</button>
  `,
}

export const register = () => registerComponent(component)
