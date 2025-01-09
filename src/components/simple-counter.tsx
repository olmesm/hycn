import { html } from "hybrids"
import { DefineComponent } from "../utils/types"

export type Type = DefineComponent<{
  count: number
}>

export function increaseCount(host: Type["Props"]) {
  host.count += 1
}

export const component: Type["Component"] = {
  count: 0,
  render: ({ count }) => html`
    <button onclick="${increaseCount}">Count: ${count}</button>
  `,
}
