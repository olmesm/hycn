import { html } from "hybrids"
import { DefineComponent } from "../utils/types"
import { css } from "../utils/string-utils"

export type Type = DefineComponent<{
  disabled: boolean
  type: "button" | "submit" | "reset"
}>

const unstyledButtonStyles = css`
  button {
    all: unset;
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }
`

export const component: Type["Component"] = {
  disabled: false,
  type: "button",
  render: ({ disabled, type }) =>
    html`
      <button type="${type}" ${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    `.style(unstyledButtonStyles),
}
