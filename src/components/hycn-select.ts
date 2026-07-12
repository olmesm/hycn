import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface SelectOption {
	disabled?: boolean
	label: string
	value: string
}

export interface SelectProps {
	disabled: boolean
	label: string
	options: SelectOption[]
	placeholder: string
	required: boolean
	value: string
}

export type Type = DefineComponent<SelectProps>
type Host = Type["Props"]

const defaults = new WeakMap<Host, string>()
const internals = new WeakMap<Host, ElementInternals>()

function sync(host: Host) {
	let control = internals.get(host)
	if (!control) {
		control = host.attachInternals()
		internals.set(host, control)
	}
	control.setFormValue(host.disabled ? null : host.value)
	const missing = host.required && !host.value
	control.setValidity(
		missing ? { valueMissing: true } : {},
		missing ? "Choose an option." : "",
		host.shadowRoot?.querySelector("select") ?? undefined,
	)
}

function change(host: Host, event: Event) {
	host.value = (event.target as HTMLSelectElement).value
	sync(host)
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { value: host.value },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-select",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Choose an option",
	options: { value: [] },
	placeholder: "",
	required: { value: false, reflect: true, observe: sync },
	value: { value: "", reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`
			<label part="label">
				<span part="text">${host.label}</span>
				<select
					disabled="${host.disabled}"
					onchange="${change}"
					part="control"
					required="${host.required}"
				>
					${
						host.placeholder
							? html`<option disabled hidden selected="${!host.value}" value="">${host.placeholder}</option>`
							: ""
					}
					${host.options.map(
						(option) => html`<option
							disabled="${option.disabled}"
							selected="${option.value === host.value}"
							value="${option.value}"
						>${option.label}</option>`,
					)}
				</select>
			</label>
		`.style(`:host { display: inline-block; } label { display: grid; gap: .375rem; }`),
	},
}

export const register = () =>
	registerFormComponent(component, {
		formDisabledCallback(disabled) {
			this.disabled = disabled
		},
		formResetCallback() {
			this.value = defaults.get(this) ?? ""
		},
		formStateRestoreCallback(state) {
			if (typeof state === "string") this.value = state
		},
	})
