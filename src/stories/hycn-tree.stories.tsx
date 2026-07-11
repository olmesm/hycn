import "../main"

export default { title: "Components/Tree" }

const files = [
	{
		id: "src",
		label: "src",
		children: [
			{ id: "components", label: "components" },
			{ id: "index", label: "index.ts" },
		],
	},
	{ id: "readme", label: "README.md" },
]

export const Default = () => (
	<hycn-tree expanded={["src"]} items={files} label="Project files"></hycn-tree>
)
