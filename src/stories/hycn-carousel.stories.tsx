import "../main"

export default { title: "Components/Carousel" }

export const Default = () => (
	<hycn-carousel label="Featured projects" loop>
		<div slot="slide">
			<h2>Accessible foundations</h2>
			<p>Native semantics first.</p>
		</div>
		<div slot="slide">
			<h2>Framework independent</h2>
			<p>Standard custom elements.</p>
		</div>
		<div slot="slide">
			<h2>Typed APIs</h2>
			<p>Generated declarations and metadata.</p>
		</div>
	</hycn-carousel>
)
