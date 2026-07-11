const focusableSelector = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
].join(",")

export function isHTMLElement(value: EventTarget | null): value is HTMLElement {
	return value instanceof HTMLElement
}

export function focusableElements(root: ParentNode): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
		(element) => !element.hidden && element.getAttribute("aria-hidden") !== "true",
	)
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
