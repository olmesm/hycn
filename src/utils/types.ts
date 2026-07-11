import type { Component as HybridsComponent } from "hybrids"

export type DefineComponent<PublicProps extends object, State extends object = PublicProps> = {
	Props: State & HTMLElement
	Element: PublicProps & HTMLElement
	Component: HybridsComponent<State>
	Definition: Partial<PublicProps> & {
		className?: string
		id?: string
		slot?: string
		style?: Record<string, string | number>
	}
}
