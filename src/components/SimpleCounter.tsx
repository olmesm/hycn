import { define, html } from "hybrids"

interface SimpleCounter {
  count: number
}

export function increaseCount(host: SimpleCounter) {
  host.count += 1
}

export const komponent = {
  count: 0,
  render: ({ count }: any) => html`
    <button onclick="${increaseCount}">Count: ${count}</button>
  `,
}
