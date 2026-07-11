import { tabbable } from "tabbable"

export function isHTMLElement(value: EventTarget | null): value is HTMLElement {
	return value instanceof HTMLElement
}

export function tabbableElements(root: Element) {
	return tabbable(root, { getShadowRoot: true })
}

export function eventElement(event: Event, predicate: (element: HTMLElement) => boolean) {
	return event.composedPath().find((value): value is HTMLElement => {
		return value instanceof HTMLElement && predicate(value)
	})
}

export function clampIndex(index: number, length: number) {
	if (length === 0) return -1
	return (index + length) % length
}

let id = 0

export function uniqueId(prefix: string) {
	id += 1
	return `${prefix}-${id}`
}

export function deepActiveElement(root: Document | ShadowRoot = document): Element | null {
	const active = root.activeElement
	if (active?.shadowRoot) return deepActiveElement(active.shadowRoot) ?? active
	return active
}
