import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface RadioOption {
	disabled?: boolean
	label: string
	value: string
}

export interface RadioGroupProps {
	disabled: boolean
	label: string
	options: RadioOption[]
	orientation: "horizontal" | "vertical"
	required: boolean
	value: string
}

interface RadioGroupState extends RadioGroupProps {
	render: () => ShadowRoot
}

export type Type = DefineComponent<RadioGroupProps, RadioGroupState>
type Host = Type["Props"]
const defaults = new WeakMap<Host, string>()
const internals = new WeakMap<Host, ElementInternals>()
const sync = (host: Host) => {
	let control = internals.get(host)
	if (!control) {
		control = host.attachInternals()
		internals.set(host, control)
	}
	control.setFormValue(host.value && !host.disabled ? host.value : null)
	control.setValidity(
		host.required && !host.value ? { valueMissing: true } : {},
		host.required && !host.value ? "Select an option." : "",
	)
}

function onChange(host: Host, event: Event) {
	const input = event.target as HTMLInputElement
	if (!input.checked) return
	host.value = input.value
	sync(host)
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { value: host.value },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-radio-group",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Choose an option",
	options: { value: [] },
	orientation: { value: "vertical", reflect: true },
	required: { value: false, reflect: true, observe: sync },
	value: { value: "", reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`
			<fieldset data-orientation="${host.orientation}" part="group">
				<legend part="label">${host.label}</legend>
				${host.options.map(
					(option) => html`
						<label part="option">
							<input
								checked="${option.value === host.value}"
								disabled="${host.disabled || option.disabled}"
								name="hycn-radio"
								onchange="${onChange}"
								required="${host.required}"
								type="radio"
								value="${option.value}"
							/>
							<span>${option.label}</span>
						</label>
					`,
				)}
			</fieldset>
		`.style(`
			:host { display: block; }
			fieldset { border: 0; display: flex; gap: .75rem; margin: 0; padding: 0; }
			fieldset[data-orientation="vertical"] { flex-direction: column; }
			[part="option"] { align-items: center; display: inline-flex; gap: .375rem; }
		`),
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
