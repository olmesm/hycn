import { html } from "hybrids"
import { focusableElements } from "../utils/dom.js"
import { emit } from "../utils/events.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface DialogProps {
	close: (reason?: string) => void
	closeOnBackdrop: boolean
	label: string
	modal: boolean
	open: boolean
}

export type Type = DefineComponent<DialogProps>
type Host = Type["Props"]

const previousFocus = new WeakMap<Host, HTMLElement>()
const inertedElements = new WeakMap<Host, Map<HTMLElement, boolean>>()

const styles = `
	:host { display: contents; }
	[part="backdrop"] {
		align-items: center;
		background: color-mix(in srgb, black 55%, transparent);
		display: flex;
		inset: 0;
		justify-content: center;
		padding: var(--hycn-dialog-gutter, 1rem);
		position: fixed;
		z-index: var(--hycn-dialog-z-index, 1000);
	}
	[part="backdrop"][hidden] { display: none; }
	[part="panel"] {
		background: var(--hycn-dialog-background, Canvas);
		border-radius: var(--hycn-dialog-radius, .75rem);
		box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 30%);
		color: var(--hycn-dialog-color, CanvasText);
		max-block-size: calc(100dvh - 2 * var(--hycn-dialog-gutter, 1rem));
		max-inline-size: min(42rem, 100%);
		overflow: auto;
		padding: var(--hycn-dialog-padding, 1.5rem);
		width: 100%;
	}
`

function focusDialog(host: Host) {
	queueMicrotask(() => {
		if (!host.open) return
		const autofocus = host.querySelector<HTMLElement>("[autofocus]")
		const first = focusableElements(host)[0]
		const panel = host.shadowRoot?.querySelector<HTMLElement>("[part='panel']")
		;(autofocus ?? first ?? panel)?.focus()
	})
}

function setOutsideInert(host: Host, inert: boolean) {
	if (!inert) {
		for (const [element, previous] of inertedElements.get(host) ?? []) element.inert = previous
		inertedElements.delete(host)
		return
	}

	const changed = new Map<HTMLElement, boolean>()
	let current: HTMLElement = host
	while (current.parentElement) {
		for (const sibling of current.parentElement.children) {
			if (sibling instanceof HTMLElement && sibling !== current && !changed.has(sibling)) {
				changed.set(sibling, sibling.inert)
				sibling.inert = true
			}
		}
		current = current.parentElement
	}
	inertedElements.set(host, changed)
}

function requestClose(host: Host, reason = "programmatic") {
	if (!host.open) return
	host.open = false
	emit(host, "hycn-close", { reason })
}

function onBackdropClick(host: Host, event?: Event) {
	if (!event || event.target !== event.currentTarget || !host.closeOnBackdrop) return
	requestClose(host, "backdrop")
}

function onKeyDown(host: Host, event?: Event) {
	if (!(event instanceof KeyboardEvent)) return

	if (event.key === "Escape") {
		if (emit(host, "hycn-cancel", { reason: "escape" }, { cancelable: true })) {
			requestClose(host, "escape")
		}
		return
	}

	if (event.key !== "Tab" || !host.modal) return
	const focusable = focusableElements(host)
	if (focusable.length === 0) {
		event.preventDefault()
		host.shadowRoot?.querySelector<HTMLElement>("[part='panel']")?.focus()
		return
	}

	const first = focusable[0]
	const last = focusable.at(-1)
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault()
		last?.focus()
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault()
		first?.focus()
	}
}

export const component: Type["Component"] = {
	tag: "hycn-dialog",
	close: (host) => (reason?: string) => requestClose(host, reason),
	closeOnBackdrop: true,
	label: "Dialog",
	modal: true,
	open: {
		value: false,
		reflect: true,
		observe(host, value, lastValue) {
			if (value === lastValue) return
			if (value) {
				if (document.activeElement instanceof HTMLElement) {
					previousFocus.set(host, document.activeElement)
				}
				if (host.modal) setOutsideInert(host, true)
				focusDialog(host)
			} else if (lastValue) {
				setOutsideInert(host, false)
				queueMicrotask(() => previousFocus.get(host)?.focus())
			}
		},
	},
	render: ({ label, modal, open }) =>
		html`
			<div
				part="backdrop"
				hidden="${!open}"
				onclick="${onBackdropClick}"
				onkeydown="${onKeyDown}"
			>
				<section
					aria-label="${label}"
					aria-modal="${modal ? "true" : undefined}"
					part="panel"
					role="dialog"
					tabindex="-1"
				>
					<slot></slot>
				</section>
			</div>
		`.style(styles),
}

export const register = () => registerComponent(component)
