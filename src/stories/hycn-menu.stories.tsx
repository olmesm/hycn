import "../main"

export default { title: "Components/Menu" }

export const Default = () => (
	<hycn-menu label="Document actions">
		<button slot="trigger" type="button">
			Actions
		</button>
		<button data-value="rename" type="button">
			Rename
		</button>
		<button data-value="duplicate" type="button">
			Duplicate
		</button>
		<button data-value="archive" type="button">
			Archive
		</button>
	</hycn-menu>
)
