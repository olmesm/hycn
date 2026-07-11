import { html } from "hybrids"
import { registerComponent } from "../utils/register.js"
import { css } from "../utils/string-utils.js"
import type { DefineComponent } from "../utils/types.js"

export type Type = DefineComponent<object>

const inlineStyles = css`
  span {
    position: absolute;
    border: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    word-wrap: normal;
  }
`

export const component: Type["Component"] = {
	tag: "hycn-visually-hidden",
	render: () => html`<span><slot></slot></span>`.style(inlineStyles),
}

export const register = () => registerComponent(component)
