import "../main"

export default { title: "Components/Accordion" }

export const Default = () => (
	<hycn-accordion exclusive>
		<details open>
			<summary>What is HYCN?</summary>
			<p>An accessible Web Component library built with Hybrids.</p>
		</details>
		<details>
			<summary>Can more than one section open?</summary>
			<p>Remove the exclusive attribute to allow independent disclosures.</p>
		</details>
		<details>
			<summary>Does it work without JavaScript?</summary>
			<p>The native details and summary content remains usable before registration.</p>
		</details>
	</hycn-accordion>
)
