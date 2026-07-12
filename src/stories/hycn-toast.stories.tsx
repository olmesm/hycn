import { useRef } from "react"
import "../main"
export default { title: "Components/Toast" }
export const Default = () => {
	const toast = useRef<HTMLElementTagNameMap["hycn-toast"]>(null)
	return (
		<>
			<button type="button" onClick={() => toast.current?.show("Changes saved")}>
				Show notification
			</button>
			<hycn-toast duration={0} ref={toast}></hycn-toast>
		</>
	)
}
