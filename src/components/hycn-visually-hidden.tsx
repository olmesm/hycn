import { html } from "hybrids"
import { DefineComponent } from "../utils/types"
import { css } from "../utils/string-utils"

export type Type = DefineComponent<{}>

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
  render: () => html`<span><slot></slot></span>`.style(inlineStyles),
}
