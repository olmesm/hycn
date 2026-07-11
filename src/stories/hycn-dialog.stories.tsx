import { useRef } from "react"
import "../main"

export default { title: "Components/Dialog" }

export const Default = () => {
	const dialog = useRef<HTMLElementTagNameMap["hycn-dialog"]>(null)
	return (
		<>
			<button
				type="button"
				onClick={() => {
					if (dialog.current) dialog.current.open = true
				}}
			>
				Open dialog
			</button>
			<hycn-dialog label="Account settings" ref={dialog}>
				<h2>Account settings</h2>
				<p>Dialog content can contain any light-DOM content.</p>
				<button type="button" onClick={() => dialog.current?.close("button")}>
					Save and close
				</button>
			</hycn-dialog>
		</>
	)
}
