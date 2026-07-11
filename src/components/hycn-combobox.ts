import { html } from "hybrids"
import { clampIndex, eventElement, uniqueId } from "../utils/dom.js"
import { emit } from "../utils/events.js"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface ComboboxOption {
	disabled?: boolean
	label: string
	value: string
}

export interface ComboboxProps {
	activeIndex: number
	disabled: boolean
	label: string
	listboxId: string
	open: boolean
	options: ComboboxOption[]
	placeholder: string
	query: string
	value: string
}

export type Type = DefineComponent<ComboboxProps>
type Host = Type["Props"]

function filteredOptions(host: Host) {
	const query = host.query.trim().toLocaleLowerCase()
	return host.options.filter((option) => !query || option.label.toLocaleLowerCase().includes(query))
}

function enabledIndexes(host: Host) {
	return filteredOptions(host)
		.map((option, index) => (option.disabled ? -1 : index))
		.filter((index) => index >= 0)
}

function moveActive(host: Host, direction: 1 | -1) {
	const indexes = enabledIndexes(host)
	if (indexes.length === 0) {
		host.activeIndex = -1
		return
	}
	const current = indexes.indexOf(host.activeIndex)
	host.activeIndex = indexes[clampIndex(current + direction, indexes.length)] ?? indexes[0] ?? -1
}

function select(host: Host, index: number) {
	const option = filteredOptions(host)[index]
	if (!option || option.disabled) return
	host.value = option.value
	host.query = option.label
	host.open = false
	host.activeIndex = index
	emit(host, "hycn-change", { label: option.label, value: option.value })
}

function onInput(host: Host, event?: Event) {
	if (!(event?.target instanceof HTMLInputElement)) return
	host.query = event.target.value
	host.open = true
	host.activeIndex = enabledIndexes(host)[0] ?? -1
	emit(host, "hycn-input", { query: host.query })
}

function onFocus(host: Host) {
	if (!host.disabled) host.open = true
}

function onKeyDown(host: Host, event?: Event) {
	if (!(event instanceof KeyboardEvent) || host.disabled) return
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

function onOptionClick(host: Host, event?: Event) {
	if (!event) return
	const option = eventElement(event, (element) => element.dataset.optionIndex !== undefined)
	if (!option) return
	select(host, Number(option.dataset.optionIndex))
}

function preventBlur(_host: Host, event?: Event) {
	event?.preventDefault()
}

export const component: Type["Component"] = {
	tag: "hycn-combobox",
	activeIndex: -1,
	disabled: { value: false, reflect: true },
	label: "Choose an option",
	listboxId: () => uniqueId("hycn-listbox"),
	open: { value: false, reflect: true },
	options: { value: [] as ComboboxOption[] },
	placeholder: "",
	query: "",
	value: {
		value: "",
		reflect: true,
		observe(host, value, lastValue) {
			if (value === lastValue || host.query) return
			const option = host.options.find((item) => item.value === value)
			if (option) host.query = option.label
		},
	},
	render: (host) => {
		const options = filteredOptions(host)
		return html`
			<div part="base">
				<input
					aria-activedescendant="${host.activeIndex >= 0 ? `${host.listboxId}-option-${host.activeIndex}` : undefined}"
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
						options.length > 0
							? options.map((option, index) =>
									html`
									<div
										aria-disabled="${option.disabled ? "true" : undefined}"
										aria-selected="${String(option.value === host.value)}"
										data-option-index="${index}"
										id="${host.listboxId}-option-${index}"
										onmousedown="${preventBlur}"
										onclick="${onOptionClick}"
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
			[part="option"]:hover { background: color-mix(in srgb, Highlight 18%, transparent); }
			[part="option"][aria-disabled="true"] { opacity: .5; }
		`)
	},
}

export const register = () => registerComponent(component)
