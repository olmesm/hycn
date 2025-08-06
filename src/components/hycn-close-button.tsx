import { html } from "hybrids"
import { DefineComponent } from "../utils/types"
import { css } from "../utils/string-utils"

export type Type = DefineComponent<{
  size: "xs" | "sm" | "md" | "lg" | "xl"
  variant: "filled" | "outline" | "subtle" | "transparent"
  disabled: boolean
  iconSize?: number
}>

const closeButtonStyles = css`
  :host {
    --hycn-color-gray: #6c757d;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 1px solid transparent;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    border-radius: 4px;
    color: var(--hycn-color-gray);
    -webkit-tap-highlight-color: transparent;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  button:focus-visible {
    outline: 2px solid var(--hycn-color-gray);
    outline-offset: 2px;
  }

  .size-xs {
    width: 1.875rem;
    height: 1.875rem;
  }
  .size-sm {
    width: 2.25rem;
    height: 2.25rem;
  }
  .size-md {
    width: 2.625rem;
    height: 2.625rem;
  }
  .size-lg {
    width: 3.125rem;
    height: 3.125rem;
  }
  .size-xl {
    width: 3.75rem;
    height: 3.75rem;
  }

  .variant-filled {
    background-color: var(--hycn-color-gray);
    color: white;
  }

  .variant-filled:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-gray) 90%, black);
  }

  .variant-outline {
    border-color: var(--hycn-color-gray);
  }

  .variant-outline:hover:not(:disabled) {
    background-color: var(--hycn-color-gray);
    color: white;
  }

  .variant-subtle {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 10%,
      transparent
    );
  }

  .variant-subtle:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 15%,
      transparent
    );
  }

  .variant-transparent:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

export const component: Type["Component"] = {
  size: "md",
  variant: "subtle",
  disabled: false,
  iconSize: undefined,
  render: ({ size, variant, disabled, iconSize }) => {
    const classes = [`size-${size}`, `variant-${variant}`]
      .filter(Boolean)
      .join(" ")

    const iconSizeValue =
      iconSize ||
      (size === "xs"
        ? 12
        : size === "sm"
          ? 14
          : size === "md"
            ? 16
            : size === "lg"
              ? 18
              : 20)

    return html`
      <button
        class="${classes}"
        type="button"
        ?disabled=${disabled}
        aria-label="Close"
      >
        <svg
          width="${iconSizeValue}"
          height="${iconSizeValue}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `.style(closeButtonStyles)
  },
}
