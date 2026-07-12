import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface DatePickerProps {
	disabled: boolean
	label: string
	max: string
	min: string
	required: boolean
	value: string
}
export type Type = DefineComponent<DatePickerProps>
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
	control.setValidity(
		host.required && !host.value ? { valueMissing: true } : {},
		host.required && !host.value ? "Choose a date." : "",
		host.shadowRoot?.querySelector("input") ?? undefined,
	)
}
function update(host: Host, event: Event) {
	host.value = (event.target as HTMLInputElement).value
	sync(host)
	dispatch(host, "hycn-change", { bubbles: true, composed: true, detail: { value: host.value } })
}
export const component: Type["Component"] = {
	tag: "hycn-date-picker",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Date",
	max: "",
	min: "",
	required: { value: false, reflect: true, observe: sync },
	value: { value: "", reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`<label part="label"><span part="text">${host.label}</span><input disabled="${host.disabled}" max="${host.max || undefined}" min="${host.min || undefined}" onchange="${update}" part="control" required="${host.required}" type="date" value="${host.value}" /></label>`.style(
				`:host { display: inline-block; } label { display: grid; gap: .375rem; }`,
			),
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
