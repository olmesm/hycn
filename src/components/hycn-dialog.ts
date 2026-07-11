import { dispatch, html } from "hybrids"
import { deepActiveElement, tabbableElements } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface DialogProps {
	close: (reason?: string) => void
	closeOnBackdrop: boolean
	label: string
	modal: boolean
	open: boolean
}

interface DialogState extends DialogProps {
	panel: HTMLElement | null
	render: () => ShadowRoot
}

export type Type = DefineComponent<DialogProps, DialogState>
type Host = Type["Props"]

const previousFocus = new WeakMap<Host, HTMLElement>()

interface ModalManager {
	active: Host[]
	document: Document
	observer: MutationObserver
	originals: Map<HTMLElement, boolean>
}

const modalManagers = new WeakMap<Document, ModalManager>()

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
	[part="backdrop"][data-modal="false"] {
		background: transparent;
		inset: auto var(--hycn-dialog-gutter, 1rem) var(--hycn-dialog-gutter, 1rem) auto;
		padding: 0;
		pointer-events: none;
	}
	[part="backdrop"][data-modal="false"] [part="panel"] { pointer-events: auto; }
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

function getModalManager(document: Document) {
	let manager = modalManagers.get(document)
	if (!manager) {
		manager = {
			active: [],
			document,
			observer: new MutationObserver(() => {
				const current = modalManagers.get(document)
				if (current) recomputeModalIsolation(current)
			}),
			originals: new Map(),
		}
		modalManagers.set(document, manager)
	}
	return manager
}

function restoreManager(manager: ModalManager) {
	for (const [element, previous] of manager.originals) element.inert = previous
	manager.originals.clear()
}

function composedParent(element: HTMLElement) {
	if (element.parentElement) return element.parentElement
	const root = element.getRootNode()
	return root instanceof ShadowRoot && root.host instanceof HTMLElement ? root.host : null
}

function siblings(element: HTMLElement) {
	if (element.parentElement) return Array.from(element.parentElement.children)
	const root = element.getRootNode()
	return root instanceof ShadowRoot ? Array.from(root.children) : []
}

function recomputeModalIsolation(manager: ModalManager) {
	restoreManager(manager)
	manager.active = manager.active.filter((host) => host.isConnected && host.open && host.modal)
	manager.observer.disconnect()
	const top = manager.active.at(-1)
	if (!top) return

	manager.observer.observe(manager.document.documentElement, { childList: true, subtree: true })
	let current: HTMLElement | null = top
	while (current) {
		const root = current.getRootNode()
		if (root instanceof ShadowRoot)
			manager.observer.observe(root, { childList: true, subtree: true })
		for (const sibling of siblings(current)) {
			if (
				sibling instanceof HTMLElement &&
				sibling !== current &&
				!manager.originals.has(sibling)
			) {
				manager.originals.set(sibling, sibling.inert)
				sibling.inert = true
			}
		}
		current = composedParent(current)
	}
}

function syncModal(host: Host) {
	const manager = getModalManager(host.ownerDocument)
	const shouldBeActive = host.open && host.modal && host.isConnected
	const index = manager.active.indexOf(host)
	if (shouldBeActive && index < 0) manager.active.push(host)
	else if (!shouldBeActive && index >= 0) manager.active.splice(index, 1)
	recomputeModalIsolation(manager)
}

function deactivateModal(host: Host) {
	const manager = modalManagers.get(host.ownerDocument)
	if (!manager) return
	const index = manager.active.indexOf(host)
	if (index >= 0) manager.active.splice(index, 1)
	recomputeModalIsolation(manager)
}

function focusDialog(host: Host) {
	const panel = host.panel
	const autofocus = host.querySelector<HTMLElement>("[autofocus]")
	const first = tabbableElements(host)[0]
	;(autofocus ?? first ?? panel)?.focus()
}

function restoreFocus(host: Host) {
	const previous = previousFocus.get(host)
	previousFocus.delete(host)
	if (previous?.isConnected) previous.focus()
}

function cleanup(host: Host) {
	deactivateModal(host)
	restoreFocus(host)
}

function requestClose(host: Host, reason = "programmatic") {
	if (!host.open) return
	host.open = false
	dispatch(host, "hycn-close", {
		bubbles: true,
		composed: true,
		detail: { reason },
	})
}

function onBackdropClick(host: Host, event: Event) {
	if (event.target === event.currentTarget && host.closeOnBackdrop) requestClose(host, "backdrop")
}

function onKeyDown(host: Host, event: KeyboardEvent) {
	if (event.defaultPrevented) return
	if (event.key === "Escape") {
		const shouldClose = dispatch(host, "hycn-cancel", {
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: { reason: "escape" },
		})
		if (shouldClose) requestClose(host, "escape")
		return
	}

	if (event.key !== "Tab" || !host.modal) return
	const items = tabbableElements(host)
	if (items.length === 0) {
		event.preventDefault()
		host.panel?.focus()
		return
	}

	const active = deepActiveElement()
	const first = items[0]
	const last = items.at(-1)
	if (event.shiftKey && (active === first || active === host.panel)) {
		event.preventDefault()
		last?.focus()
	} else if (!event.shiftKey && active === last) {
		event.preventDefault()
		first?.focus()
	}
}

export const component: Type["Component"] = {
	tag: "hycn-dialog",
	close: (host) => (reason?: string) => requestClose(host, reason),
	closeOnBackdrop: true,
	label: "Dialog",
	modal: {
		value: true,
		observe: syncModal,
	},
	open: {
		value: false,
		reflect: true,
		observe(host, value, lastValue) {
			if (value === lastValue) return
			if (value) {
				const active = deepActiveElement()
				if (active instanceof HTMLElement) previousFocus.set(host, active)
				syncModal(host)
				focusDialog(host)
			} else if (lastValue) {
				deactivateModal(host)
				restoreFocus(host)
			}
		},
	},
	panel: ({ render }) => render().querySelector<HTMLElement>("[part='panel']"),
	render: {
		connect(host) {
			return () => cleanup(host)
		},
		value: ({ label, modal, open }) =>
			html`
				<div
					data-modal="${String(modal)}"
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
	},
}

export const register = () => registerComponent(component)
