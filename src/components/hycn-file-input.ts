import { dispatch, html } from "hybrids"
import { registerFormComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface FileInputProps {
	accept: string
	disabled: boolean
	files: FileList | null
	label: string
	multiple: boolean
	required: boolean
}

export type Type = DefineComponent<FileInputProps>
type Host = Type["Props"]

const internals = new WeakMap<Host, ElementInternals>()
const selectedFiles = new WeakMap<Host, FileList>()

function sync(host: Host) {
	let control = internals.get(host)
	if (!control) {
		control = host.attachInternals()
		internals.set(host, control)
	}
	const files =
		selectedFiles.get(host) ?? host.shadowRoot?.querySelector<HTMLInputElement>("input")?.files
	if (host.disabled || !files?.length) {
		control.setFormValue(null)
	} else if (host.multiple) {
		const data = new FormData()
		const name = host.getAttribute("name") ?? "file"
		for (const file of files) data.append(name, file)
		control.setFormValue(data)
	} else {
		control.setFormValue(files[0] ?? null)
	}
	const missing = host.required && !files?.length
	control.setValidity(
		missing ? { valueMissing: true } : {},
		missing ? "Choose a file." : "",
		host.shadowRoot?.querySelector("input") ?? undefined,
	)
}

function change(host: Host, event: Event) {
	const files = (event.target as HTMLInputElement).files
	if (files) selectedFiles.set(host, files)
	sync(host)
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { files },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-file-input",
	accept: "",
	disabled: { value: false, reflect: true, observe: sync },
	files: (host) =>
		selectedFiles.get(host) ??
		host.shadowRoot?.querySelector<HTMLInputElement>("input")?.files ??
		null,
	label: "Choose a file",
	multiple: { value: false, reflect: true },
	required: { value: false, reflect: true, observe: sync },
	render: {
		connect: sync,
		value: (host) =>
			html`
			<label part="label">
				<span part="text">${host.label}</span>
				<input
					accept="${host.accept || undefined}"
					disabled="${host.disabled}"
					multiple="${host.multiple}"
					onchange="${change}"
					part="control"
					required="${host.required}"
					type="file"
				/>
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
			const input = this.shadowRoot?.querySelector<HTMLInputElement>("input")
			if (input) input.value = ""
			selectedFiles.delete(this)
			sync(this)
		},
		formStateRestoreCallback() {},
	})
