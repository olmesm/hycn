import "../main"

export default { title: "Components/Tabs" }

export const Default = () => (
	<hycn-tabs>
		<button slot="tab" type="button">
			Overview
		</button>
		<button slot="tab" type="button">
			API
		</button>
		<section slot="panel">A keyboard-accessible tab interface.</section>
		<section slot="panel">Properties, events, slots, parts, and keyboard behavior.</section>
	</hycn-tabs>
)
