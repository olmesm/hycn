import "../main"
export default { title: "Components/Popover" }
export const Default = () => (
	<hycn-popover label="Profile details">
		<button slot="trigger" type="button">
			Profile
		</button>
		<strong>Oliver</strong>
		<p>Account details and actions.</p>
	</hycn-popover>
)
