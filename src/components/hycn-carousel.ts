import { dispatch, html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import type { DefineComponent } from "../utils/types.js"

export interface CarouselProps {
	label: string
	loop: boolean
	selectedIndex: number
}

export type Type = DefineComponent<CarouselProps>
type Host = Type["Props"]

const slidesFor = (host: Host) => Array.from(host.children).filter((item) => item.slot === "slide")
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function sync(host: Host) {
	const slides = slidesFor(host)
	if (!slides.length) return
	host.selectedIndex = clamp(host.selectedIndex, 0, slides.length - 1)
	for (const [index, slide] of slides.entries()) {
		slide.setAttribute("role", "group")
		slide.setAttribute("aria-roledescription", "slide")
		slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`)
		slide.toggleAttribute("hidden", index !== host.selectedIndex)
		Reflect.set(slide, "inert", index !== host.selectedIndex)
	}
}

function select(host: Host, index: number) {
	const count = slidesFor(host).length
	if (!count) return
	const next = host.loop ? (index + count) % count : clamp(index, 0, count - 1)
	if (next === host.selectedIndex) return
	host.selectedIndex = next
	sync(host)
	dispatch(host, "hycn-change", {
		bubbles: true,
		composed: true,
		detail: { index: next },
	})
}

export const component: Type["Component"] = {
	tag: "hycn-carousel",
	label: "Carousel",
	loop: { value: false, reflect: true },
	selectedIndex: { value: 0, reflect: true, observe: sync },
	render: {
		connect(host) {
			const observer = new MutationObserver(() => sync(host))
			observer.observe(host, { childList: true })
			sync(host)
			return () => observer.disconnect()
		},
		value: (host) =>
			html`
			<section aria-label="${host.label}" aria-roledescription="carousel" part="base">
				<div aria-live="polite" part="slides"><slot name="slide" onslotchange="${sync}"></slot></div>
				<div part="controls">
					<button
						aria-label="Previous slide"
						disabled="${!host.loop && host.selectedIndex <= 0}"
						onclick="${(host: Host) => select(host, host.selectedIndex - 1)}"
						part="previous"
						type="button"
					>‹</button>
					<button
						aria-label="Next slide"
						disabled="${!host.loop && host.selectedIndex >= slidesFor(host).length - 1}"
						onclick="${(host: Host) => select(host, host.selectedIndex + 1)}"
						part="next"
						type="button"
					>›</button>
				</div>
			</section>
		`.style(
				`:host { display: block; } [part="controls"] { display: flex; gap: .5rem; margin-block-start: .5rem; }`,
			),
	},
}

export const register = () => registerComponent(component)
