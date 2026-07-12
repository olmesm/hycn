import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface NumberInputProps {
	disabled: boolean
	label: string
	max: number
	min: number
	required: boolean
	step: number
	value: number
}
export type Type = DefineComponent<NumberInputProps>
type Host = Type["Props"]
const defaults = new WeakMap<Host, number>()
const internals = new WeakMap<Host, ElementInternals>()
function sync(host: Host) {
	let control = internals.get(host)
	if (!control) {
		control = host.attachInternals()
		internals.set(host, control)
	}
	const input = host.shadowRoot?.querySelector<HTMLInputElement>("input")
	control.setFormValue(host.disabled || Number.isNaN(host.value) ? null : String(host.value))
	control.setValidity(
		host.required && Number.isNaN(host.value) ? { valueMissing: true } : {},
		host.required && Number.isNaN(host.value) ? "Enter a number." : "",
		input ?? undefined,
	)
}
function update(host: Host, event: Event, name: "hycn-change" | "hycn-input") {
	host.value = (event.target as HTMLInputElement).valueAsNumber
	sync(host)
	dispatch(host, name, { bubbles: true, composed: true, detail: { value: host.value } })
}
export const component: Type["Component"] = {
	tag: "hycn-number-input",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Number",
	max: { value: Number.MAX_SAFE_INTEGER, reflect: true },
	min: { value: Number.MIN_SAFE_INTEGER, reflect: true },
	required: { value: false, reflect: true, observe: sync },
	step: { value: 1, reflect: true },
	value: { value: 0, reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`<label part="label"><span part="text">${host.label}</span><input disabled="${host.disabled}" max="${host.max}" min="${host.min}" onchange="${(host: Host, event: Event) => update(host, event, "hycn-change")}" oninput="${(host: Host, event: Event) => update(host, event, "hycn-input")}" part="control" required="${host.required}" step="${host.step}" type="number" value="${host.value}" /></label>`.style(
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
			this.value = defaults.get(this) ?? 0
		},
		formStateRestoreCallback(state) {
			if (typeof state === "string") this.value = Number(state)
		},
	})
