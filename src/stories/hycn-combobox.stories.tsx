import "../main"

export default { title: "Components/Combobox" }

const countries = [
	{ label: "France", value: "fr" },
	{ label: "Portugal", value: "pt" },
	{ label: "Spain", value: "es" },
]

export const Default = () => (
	<hycn-combobox
		label="Country"
		options={countries}
		placeholder="Type to filter countries"
	></hycn-combobox>
)
