import { type Component, define } from "hybrids"

export function registerComponent<Props extends object>(component: Component<Props>) {
	if (!customElements.get(component.tag)) {
		define(component)
	}

	return component
}
