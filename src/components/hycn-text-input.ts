import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface TextInputProps {
	disabled: boolean
	label: string
	placeholder: string
	required: boolean
	type: "email" | "password" | "search" | "tel" | "text" | "url"
	value: string
}
export type Type = DefineComponent<TextInputProps>
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
		host.required && !host.value ? "Enter a value." : "",
		host.shadowRoot?.querySelector("input") ?? undefined,
	)
}
function update(host: Host, event: Event, name: "hycn-change" | "hycn-input") {
	host.value = (event.target as HTMLInputElement).value
	sync(host)
	dispatch(host, name, { bubbles: true, composed: true, detail: { value: host.value } })
}
export const component: Type["Component"] = {
	tag: "hycn-text-input",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Text",
	placeholder: "",
	required: { value: false, reflect: true, observe: sync },
	type: { value: "text", reflect: true },
	value: { value: "", reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`<label part="label"><span part="text">${host.label}</span><input disabled="${host.disabled}" oninput="${(host: Host, event: Event) => update(host, event, "hycn-input")}" onchange="${(host: Host, event: Event) => update(host, event, "hycn-change")}" part="control" placeholder="${host.placeholder}" required="${host.required}" type="${host.type}" value="${host.value}" /></label>`.style(
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
