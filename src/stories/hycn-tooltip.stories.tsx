import "../main"
export default { title: "Components/Tooltip" }
export const Default = () => (
	<hycn-tooltip delay={0}>
		<button slot="trigger" type="button">
			Save
		</button>
		Save your changes
	</hycn-tooltip>
)
