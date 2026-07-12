import { dispatch, html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface ToastMessage {
	id: string
	message: string
	tone?: "assertive" | "polite"
}
export interface ToastProps {
	dismiss: (id: string) => void
	duration: number
	messages: ToastMessage[]
	show: (message: string, tone?: "assertive" | "polite") => string
}
export type Type = DefineComponent<ToastProps>
type Host = Type["Props"]
let id = 0
function dismiss(host: Host, messageId: string) {
	host.messages = host.messages.filter(({ id }) => id !== messageId)
	dispatch(host, "hycn-dismiss", { bubbles: true, composed: true, detail: { id: messageId } })
}
function show(host: Host, message: string, tone: "assertive" | "polite" = "polite") {
	const messageId = `toast-${++id}`
	host.messages = [...host.messages, { id: messageId, message, tone }]
	if (host.duration > 0) setTimeout(() => dismiss(host, messageId), host.duration)
	return messageId
}
export const component: Type["Component"] = {
	tag: "hycn-toast",
	dismiss: (host) => (messageId: string) => dismiss(host, messageId),
	duration: 5000,
	messages: { value: [] },
	show: (host) => (message: string, tone?: "assertive" | "polite") => show(host, message, tone),
	render: (host) =>
		html`<div aria-label="Notifications" part="region" role="region">${host.messages.map((item) => html`<div aria-atomic="true" part="toast" role="${item.tone === "assertive" ? "alert" : "status"}"><span part="message">${item.message}</span><button aria-label="Dismiss notification" onclick="${(host: Host) => dismiss(host, item.id)}" part="dismiss" type="button">×</button></div>`)}</div>`.style(
			`:host { inset: auto 1rem 1rem auto; position: fixed; z-index: var(--hycn-toast-z-index, 1000); } [part="region"] { display: grid; gap: .5rem; } [part="toast"] { background: var(--hycn-toast-background, Canvas); border: 1px solid color-mix(in srgb, CanvasText 20%, transparent); display: flex; gap: 1rem; padding: .75rem; }`,
		),
}
export const register = () => registerComponent(component)
