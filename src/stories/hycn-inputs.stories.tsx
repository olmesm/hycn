import { useEffect, useRef } from "react"
import "../main"

export default { title: "Components/Inputs" }

export const Default = () => {
	const select = useRef<HTMLElementTagNameMap["hycn-select"]>(null)
	useEffect(() => {
		if (select.current) {
			select.current.options = [
				{ label: "France", value: "fr" },
				{ label: "Spain", value: "es" },
			]
		}
	}, [])
	return (
		<form style={{ display: "grid", gap: "1rem", maxWidth: "22rem" }}>
			<hycn-text-input label="Name" placeholder="Ada Lovelace" required />
			<hycn-number-input label="Guests" min={1} value={2} />
			<hycn-date-picker label="Arrival" />
			<hycn-select label="Country" placeholder="Choose a country" ref={select} />
			<hycn-file-input accept="image/*" label="Profile image" />
		</form>
	)
}
