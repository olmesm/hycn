import { type Component, define } from "hybrids"

type FormCallbacks<Props extends object> = Partial<{
	formAssociatedCallback(this: Props & HTMLElement, form: HTMLFormElement | null): void
	formDisabledCallback(this: Props & HTMLElement, disabled: boolean): void
	formResetCallback(this: Props & HTMLElement): void
	formStateRestoreCallback(this: Props & HTMLElement, state: File | string | null): void
}>

export function registerComponent<Props extends object>(component: Component<Props>) {
	if (!customElements.get(component.tag)) {
		define(component)
	}

	return component
}

export function registerFormComponent<Props extends object>(
	component: Component<Props>,
	callbacks: FormCallbacks<Props> = {},
) {
	if (!customElements.get(component.tag)) {
		const Element = define.compile(component)
		Object.defineProperty(Element, "formAssociated", { value: true })
		Object.assign(Element.prototype, callbacks)
		customElements.define(component.tag, Element)
	}

	return component
}
