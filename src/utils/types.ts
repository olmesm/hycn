import type { Component as HybridsComponent } from "hybrids"

export type DefineComponent<Props extends object> = {
	Props: Props & HTMLElement
	Element: Props & HTMLElement
	Component: HybridsComponent<Props>
	Definition: Partial<Props> & {
		className?: string
		id?: string
		slot?: string
		style?: Record<string, string | number>
	}
}

export type ComponentEvent<Detail> = CustomEvent<Detail>
