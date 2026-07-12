import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface CheckboxProps {
	checked: boolean
	disabled: boolean
	indeterminate: boolean
	label: string
	required: boolean
	value: string
}

export type Type = DefineComponent<CheckboxProps>
type Host = Type["Props"]
const defaults = new WeakMap<Host, boolean>()
const internals = new WeakMap<Host, ElementInternals>()
const internalsFor = (host: Host) => {
	let value = internals.get(host)
	if (!value) {
		value = host.attachInternals()
		internals.set(host, value)
	}
	return value
}

function sync(host: Host) {
	const input = host.shadowRoot?.querySelector<HTMLInputElement>("input")
	if (input) input.indeterminate = host.indeterminate
	const control = internalsFor(host)
	control.setFormValue(host.checked && !host.disabled ? host.value : null)
	control.setValidity(
		host.required && !host.checked ? { valueMissing: true } : {},
		host.required && !host.checked ? "Select this checkbox." : "",
		input ?? undefined,
	)
}

function onChange(host: Host, event: Event) {
	const input = event.target as HTMLInputElement
	host.checked = input.checked
	host.indeterminate = input.indeterminate
	sync(host)
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { checked: host.checked, value: host.value },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-checkbox",
	checked: { value: false, reflect: true, observe: sync },
	disabled: { value: false, reflect: true, observe: sync },
	indeterminate: { value: false, reflect: true, observe: sync },
	label: "Checkbox",
	required: { value: false, reflect: true, observe: sync },
	value: { value: "on", reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.checked)
			sync(host)
		},
		value: (host) =>
			html`
			<label part="label">
				<input
					checked="${host.checked}"
					disabled="${host.disabled}"
					onchange="${onChange}"
					part="control"
					required="${host.required}"
					type="checkbox"
					value="${host.value}"
				/>
				<span part="text"><slot>${host.label}</slot></span>
			</label>
		`.style(`
			:host { display: inline-block; }
			[part="label"] { align-items: center; cursor: pointer; display: inline-flex; gap: .5rem; }
			input { block-size: 1rem; inline-size: 1rem; margin: 0; }
			input:disabled + [part="text"] { opacity: .5; }
		`),
	},
}

export const register = () =>
	registerFormComponent(component, {
		formDisabledCallback(disabled) {
			this.disabled = disabled
		},
		formResetCallback() {
			this.checked = defaults.get(this) ?? false
			this.indeterminate = false
		},
		formStateRestoreCallback(state) {
			this.checked = state !== null
		},
	})
