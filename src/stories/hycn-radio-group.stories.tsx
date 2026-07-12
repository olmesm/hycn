import "../main"
const options = [
	{ label: "Small", value: "s" },
	{ label: "Medium", value: "m" },
	{ label: "Large", value: "l" },
]
export default { title: "Components/Radio Group" }
export const Default = () => <hycn-radio-group label="Size" options={options}></hycn-radio-group>
