import { dispatch, html } from "hybrids"
import { clampIndex, eventElement } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface AccordionProps {
	collapsible: boolean
	exclusive: boolean
}

export type Type = DefineComponent<AccordionProps>
type Host = Type["Props"]

const detailsFor = (host: Host) =>
	Array.from(host.querySelectorAll<HTMLDetailsElement>(":scope > details"))
const summaryFor = (details: HTMLDetailsElement) =>
	details.querySelector<HTMLElement>(":scope > summary")
const isDisabled = (details: HTMLDetailsElement) =>
	details.hasAttribute("disabled") || summaryFor(details)?.getAttribute("aria-disabled") === "true"
const enabledSummariesFor = (host: Host) =>
	detailsFor(host)
		.filter((details) => !isDisabled(details))
		.map(summaryFor)
		.filter((summary): summary is HTMLElement => Boolean(summary))
const managedDisabled = new WeakSet<HTMLElement>()

function sync(host: Host) {
	const items = detailsFor(host)
	const openItems = items.filter((details) => details.open)

	if (host.exclusive) {
		for (const details of openItems.slice(1)) details.open = false
	}

	if (!host.collapsible && !items.some((details) => details.open)) {
		const firstEnabled = items.find((details) => !isDisabled(details))
		if (firstEnabled) firstEnabled.open = true
	}

	for (const details of items) {
		const summary = summaryFor(details)
		if (!summary) continue
		const disabled = details.hasAttribute("disabled")
		if (disabled && summary.getAttribute("aria-disabled") !== "true") {
			managedDisabled.add(summary)
			summary.setAttribute("aria-disabled", "true")
		} else if (!disabled && managedDisabled.has(summary)) {
			managedDisabled.delete(summary)
			summary.removeAttribute("aria-disabled")
		}
	}
}

function itemForEvent(host: Host, event: Event) {
	const items = detailsFor(host)
	const summary = eventElement(event, (element) =>
		items.some((details) => summaryFor(details) === element),
	)
	return summary?.parentElement instanceof HTMLDetailsElement ? summary.parentElement : undefined
}

function onClick(host: Host, event: MouseEvent) {
	const details = itemForEvent(host, event)
	if (!details) return
	if (
		isDisabled(details) ||
		(!host.collapsible && details.open && detailsFor(host).filter((item) => item.open).length === 1)
	) {
		event.preventDefault()
	}
}

function onKeyDown(host: Host, event: KeyboardEvent) {
	const details = itemForEvent(host, event)
	if (!details) return
	if (isDisabled(details) && (event.key === "Enter" || event.key === " ")) {
		event.preventDefault()
		return
	}

	const summaries = enabledSummariesFor(host)
	const summary = summaryFor(details)
	const current = summary ? summaries.indexOf(summary) : -1
	let next = current
	if (event.key === "ArrowDown") next = clampIndex(current + 1, summaries.length)
	else if (event.key === "ArrowUp") next = clampIndex(current - 1, summaries.length)
	else if (event.key === "Home") next = 0
	else if (event.key === "End") next = summaries.length - 1
	else return

	event.preventDefault()
	summaries[next]?.focus()
}

function onToggle(host: Host, event: Event) {
	const details = event.target
	if (!(details instanceof HTMLDetailsElement) || details.parentElement !== host) return

	if (details.open && host.exclusive) {
		for (const item of detailsFor(host)) {
			if (item !== details) item.open = false
		}
	} else if (!details.open && !host.collapsible && !detailsFor(host).some((item) => item.open)) {
		details.open = true
		return
	}

	dispatch(host, "hycn-toggle", {
		bubbles: true,
		composed: true,
		detail: { expanded: details.open, index: detailsFor(host).indexOf(details) },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-accordion",
	collapsible: {
		value: true,
		reflect: true,
		observe: sync,
	},
	exclusive: {
		value: false,
		reflect: true,
		observe: sync,
	},
	render: {
		connect(host) {
			const observer = new MutationObserver(() => sync(host))
			const toggleHandler = (event: Event) => onToggle(host, event)
			observer.observe(host, {
				attributeFilter: ["aria-disabled", "disabled"],
				attributes: true,
				childList: true,
				subtree: true,
			})
			host.addEventListener("toggle", toggleHandler, true)
			sync(host)
			return () => {
				observer.disconnect()
				host.removeEventListener("toggle", toggleHandler, true)
			}
		},
		value: () =>
			html`
			<slot onclick="${onClick}" onkeydown="${onKeyDown}" onslotchange="${sync}"></slot>
		`.style(`
			:host { display: block; }
			::slotted(details) {
				border-block-end: 1px solid var(--hycn-accordion-border, color-mix(in srgb, CanvasText 20%, transparent));
			}
		`),
	},
}

export const register = () => registerComponent(component)
