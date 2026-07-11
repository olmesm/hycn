import { dispatch, html } from "hybrids"
import { clampIndex, eventElement, uniqueId } from "../utils/dom.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface ComboboxOption {
	disabled?: boolean
	label: string
	value: string
}

export interface ComboboxProps {
	disabled: boolean
	label: string
	open: boolean
	options: ComboboxOption[]
	placeholder: string
	query: string
	value: string
}

interface ComboboxState extends ComboboxProps {
	activeIndex: number
	activeOption: HTMLElement | null
	filteredOptions: ComboboxOption[]
	listboxId: string
	render: () => ShadowRoot
}

export type Type = DefineComponent<ComboboxProps, ComboboxState>
type Host = Type["Props"]

function enabledIndexes(options: ComboboxOption[]) {
	return options
		.map((option, index) => (option.disabled ? -1 : index))
		.filter((index) => index >= 0)
}

function normalizeActive(host: Host, options = host.filteredOptions) {
	if (options[host.activeIndex] && !options[host.activeIndex]?.disabled) return
	host.activeIndex = host.open ? (enabledIndexes(options)[0] ?? -1) : -1
}

function reconcileValueLabel(
	host: Host,
	options: ComboboxOption[],
	lastOptions: ComboboxOption[] = [],
	force = false,
) {
	const next = options.find((option) => option.value === host.value)
	const previous = lastOptions.find((option) => option.value === host.value)
	const queryMatchesSelection = host.query === (previous?.label ?? "")
	if (force || queryMatchesSelection || (!previous && !host.query)) host.query = next?.label ?? ""
}

function moveActive(host: Host, direction: 1 | -1) {
	const indexes = enabledIndexes(host.filteredOptions)
	if (indexes.length === 0) {
		host.activeIndex = -1
		return
	}
	const current = indexes.indexOf(host.activeIndex)
	host.activeIndex = indexes[clampIndex(current + direction, indexes.length)] ?? indexes[0] ?? -1
}

function select(host: Host, index: number) {
	const option = host.filteredOptions[index]
	if (!option || option.disabled) return
	host.query = option.label
	host.value = option.value
	host.open = false
	host.activeIndex = index
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { label: option.label, value: option.value },
	})
}

function onInput(host: Host, event: Event) {
	if (!(event.target instanceof HTMLInputElement)) return
	host.query = event.target.value
	host.open = true
	host.activeIndex = enabledIndexes(host.filteredOptions)[0] ?? -1
	dispatch(host, "hycn-input", {
		bubbles: true,
		composed: true,
		detail: { query: host.query },
	})
}

function onFocus(host: Host) {
	if (host.disabled) return
	host.open = true
	normalizeActive(host)
}

function onFocusOut(host: Host, event: FocusEvent) {
	const next = event.relatedTarget
	if (next instanceof Node && (host.contains(next) || host.shadowRoot?.contains(next))) return
	host.open = false
}

function onKeyDown(host: Host, event: KeyboardEvent) {
	if (host.disabled) return
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		event.preventDefault()
		host.open = true
		moveActive(host, event.key === "ArrowDown" ? 1 : -1)
	} else if (event.key === "Enter" && host.open && host.activeIndex >= 0) {
		event.preventDefault()
		select(host, host.activeIndex)
	} else if (event.key === "Escape") {
		event.preventDefault()
		host.open = false
	} else if (event.key === "Tab") {
		host.open = false
	}
}

function onOptionClick(host: Host, event: Event) {
	const option = eventElement(event, (element) => element.dataset.optionIndex !== undefined)
	if (option) select(host, Number(option.dataset.optionIndex))
}

function preventBlur(_host: Host, event: Event) {
	event.preventDefault()
}

export const component: Type["Component"] = {
	tag: "hycn-combobox",
	activeIndex: {
		value: -1,
		observe: (host) => host.activeOption?.scrollIntoView({ block: "nearest" }),
	},
	activeOption: ({ activeIndex, listboxId, open, render }) => {
		if (!open || activeIndex < 0) return null
		return render().querySelector<HTMLElement>(`#${listboxId}-option-${activeIndex}`)
	},
	disabled: { value: false, reflect: true },
	filteredOptions: {
		value: ({ options, query }) => {
			const normalized = query.trim().toLocaleLowerCase()
			return options.filter(
				(option) => !normalized || option.label.toLocaleLowerCase().includes(normalized),
			)
		},
		observe: normalizeActive,
	},
	label: "Choose an option",
	listboxId: () => uniqueId("hycn-listbox"),
	open: {
		value: false,
		reflect: true,
		observe: (host) => normalizeActive(host),
	},
	options: {
		value: [] as ComboboxOption[],
		observe: (host, options, lastOptions) => reconcileValueLabel(host, options, lastOptions),
	},
	placeholder: "",
	query: "",
	value: {
		value: "",
		reflect: true,
		observe(host, value, lastValue) {
			if (value === lastValue) return
			reconcileValueLabel(host, host.options, host.options, true)
		},
	},
	render: (host) => {
		const active = host.open ? host.filteredOptions[host.activeIndex] : undefined
		return html`
			<div onfocusout="${onFocusOut}" part="base">
				<input
					aria-activedescendant="${active ? `${host.listboxId}-option-${host.activeIndex}` : undefined}"
					aria-autocomplete="list"
					aria-controls="${host.listboxId}"
					aria-expanded="${String(host.open)}"
					aria-label="${host.label}"
					autocomplete="off"
					disabled="${host.disabled}"
					onfocus="${onFocus}"
					oninput="${onInput}"
					onkeydown="${onKeyDown}"
					part="input"
					placeholder="${host.placeholder}"
					role="combobox"
					value="${host.query}"
				/>
				<div hidden="${!host.open}" id="${host.listboxId}" part="listbox" role="listbox">
					${
						host.filteredOptions.length > 0
							? host.filteredOptions.map((option, index) =>
									html`
									<div
										aria-disabled="${option.disabled ? "true" : undefined}"
										aria-selected="${String(option.value === host.value)}"
										data-active="${index === host.activeIndex}"
										data-option-index="${index}"
										id="${host.listboxId}-option-${index}"
										onclick="${onOptionClick}"
										onmousedown="${preventBlur}"
										part="option"
										role="option"
									>
										${option.label}
									</div>
								`.key(option.value),
								)
							: html`<div part="empty">No options</div>`
					}
				</div>
			</div>
		`.style(`
			:host { display: inline-block; position: relative; }
			[part="input"] { box-sizing: border-box; font: inherit; inline-size: 100%; padding: .6rem .75rem; }
			[part="listbox"] {
				background: var(--hycn-combobox-background, Canvas);
				border: 1px solid color-mix(in srgb, CanvasText 20%, transparent);
				box-shadow: 0 .75rem 2rem rgb(0 0 0 / 16%);
				inset-block-start: calc(100% + .25rem);
				max-block-size: 16rem;
				overflow: auto;
				position: absolute;
				width: 100%;
				z-index: 100;
			}
			[part="listbox"][hidden] { display: none; }
			[part="option"], [part="empty"] { padding: .5rem .75rem; }
			[part="option"][aria-selected="true"] { font-weight: 700; }
			[part="option"]:hover, [part="option"][data-active="true"] {
				background: color-mix(in srgb, Highlight 18%, transparent);
			}
			[part="option"][aria-disabled="true"] { opacity: .5; }
		`)
	},
}

export const register = () => registerComponent(component)
