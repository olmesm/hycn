import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface SliderProps {
	disabled: boolean
	label: string
	max: number
	min: number
	step: number
	value: number
}

export type Type = DefineComponent<SliderProps>
type Host = Type["Props"]
const defaults = new WeakMap<Host, number>()
const internals = new WeakMap<Host, ElementInternals>()
const sync = (host: Host) => {
	let control = internals.get(host)
	if (!control) {
		control = host.attachInternals()
		internals.set(host, control)
	}
	control.setFormValue(host.disabled ? null : String(host.value))
}
const update = (host: Host, event: Event, name: "hycn-change" | "hycn-input") => {
	host.value = (event.target as HTMLInputElement).valueAsNumber
	sync(host)
	dispatch(host, name, {
		bubbles: true,
		composed: true,
		detail: { value: host.value },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-slider",
	disabled: { value: false, reflect: true, observe: sync },
	label: "Value",
	max: { value: 100, reflect: true },
	min: { value: 0, reflect: true },
	step: { value: 1, reflect: true },
	value: { value: 0, reflect: true, observe: sync },
	render: {
		connect(host) {
			defaults.set(host, host.value)
			sync(host)
		},
		value: (host) =>
			html`
			<label part="label">
				<span part="text"><slot>${host.label}</slot></span>
				<input
					disabled="${host.disabled}"
					max="${host.max}"
					min="${host.min}"
					onchange="${(host: Host, event: Event) => update(host, event, "hycn-change")}"
					oninput="${(host: Host, event: Event) => update(host, event, "hycn-input")}"
					part="control"
					step="${host.step}"
					type="range"
					value="${host.value}"
				/>
				<output part="output">${host.value}</output>
			</label>
		`.style(`
			:host { display: inline-block; }
			[part="label"] { display: grid; gap: .375rem; }
			[part="output"] { font-variant-numeric: tabular-nums; }
		`),
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
