import { html } from "hybrids"
import { DefineComponent } from "../utils/types"
import { css } from "../utils/string-utils"

export type Type = DefineComponent<{
  size: "xs" | "sm" | "md" | "lg" | "xl"
  variant: "filled" | "outline" | "subtle" | "transparent"
  color: "primary" | "secondary" | "success" | "warning" | "error" | "gray"
  disabled: boolean
  loading: boolean
  fullWidth: boolean
  type: "button" | "submit" | "reset"
}>

const buttonStyles = css`
  :host {
    --hycn-color-primary: #228be6;
    --hycn-color-secondary: #868e96;
    --hycn-color-success: #51cf66;
    --hycn-color-warning: #ffd43b;
    --hycn-color-error: #ff6b6b;
    --hycn-color-gray: #6c757d;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    border: 1px solid transparent;
    background-color: transparent;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    line-height: 1;
    text-decoration: none;
    transition: all 0.15s ease;
    user-select: none;
    border-radius: 4px;
    -webkit-tap-highlight-color: transparent;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  button:focus-visible {
    outline: 2px solid var(--hycn-color-primary);
    outline-offset: 2px;
  }

  /* Sizes */
  button[data-size="xs"] {
    font-size: 0.75rem;
    height: 1.875rem;
    padding: 0 0.75rem;
    min-width: 1.875rem;
  }

  button[data-size="sm"] {
    font-size: 0.875rem;
    height: 2.25rem;
    padding: 0 1rem;
    min-width: 2.25rem;
  }

  button[data-size="md"] {
    font-size: 0.875rem;
    height: 2.625rem;
    padding: 0 1.125rem;
    min-width: 2.625rem;
  }

  button[data-size="lg"] {
    font-size: 1rem;
    height: 3.125rem;
    padding: 0 1.375rem;
    min-width: 3.125rem;
  }

  button[data-size="xl"] {
    font-size: 1rem;
    height: 3.75rem;
    padding: 0 1.625rem;
    min-width: 3.75rem;
  }

  button[data-full-width="true"] {
    width: 100%;
  }

  button[data-loading="true"] {
    pointer-events: none;
  }

  .loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .content-loading {
    opacity: 0;
  }

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  /* Filled variants */
  button[data-variant="filled"][data-color="primary"] {
    background-color: var(--hycn-color-primary);
    color: white;
  }

  button[data-variant="filled"][data-color="primary"]:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-primary) 90%, black);
  }

  button[data-variant="filled"][data-color="secondary"] {
    background-color: var(--hycn-color-secondary);
    color: white;
  }

  button[data-variant="filled"][data-color="secondary"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 90%,
      black
    );
  }

  button[data-variant="filled"][data-color="success"] {
    background-color: var(--hycn-color-success);
    color: white;
  }

  button[data-variant="filled"][data-color="success"]:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-success) 90%, black);
  }

  button[data-variant="filled"][data-color="warning"] {
    background-color: var(--hycn-color-warning);
    color: #000;
  }

  button[data-variant="filled"][data-color="warning"]:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-warning) 90%, black);
  }

  button[data-variant="filled"][data-color="error"] {
    background-color: var(--hycn-color-error);
    color: white;
  }

  button[data-variant="filled"][data-color="error"]:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-error) 90%, black);
  }

  button[data-variant="filled"][data-color="gray"] {
    background-color: var(--hycn-color-gray);
    color: white;
  }

  button[data-variant="filled"][data-color="gray"]:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-gray) 90%, black);
  }

  /* Outline variants */
  button[data-variant="outline"][data-color="primary"] {
    border-color: var(--hycn-color-primary);
    color: var(--hycn-color-primary);
  }

  button[data-variant="outline"][data-color="primary"]:hover:not(:disabled) {
    background-color: var(--hycn-color-primary);
    color: white;
  }

  button[data-variant="outline"][data-color="secondary"] {
    border-color: var(--hycn-color-secondary);
    color: var(--hycn-color-secondary);
  }

  button[data-variant="outline"][data-color="secondary"]:hover:not(:disabled) {
    background-color: var(--hycn-color-secondary);
    color: white;
  }

  button[data-variant="outline"][data-color="success"] {
    border-color: var(--hycn-color-success);
    color: var(--hycn-color-success);
  }

  button[data-variant="outline"][data-color="success"]:hover:not(:disabled) {
    background-color: var(--hycn-color-success);
    color: white;
  }

  button[data-variant="outline"][data-color="warning"] {
    border-color: var(--hycn-color-warning);
    color: var(--hycn-color-warning);
  }

  button[data-variant="outline"][data-color="warning"]:hover:not(:disabled) {
    background-color: var(--hycn-color-warning);
    color: #000;
  }

  button[data-variant="outline"][data-color="error"] {
    border-color: var(--hycn-color-error);
    color: var(--hycn-color-error);
  }

  button[data-variant="outline"][data-color="error"]:hover:not(:disabled) {
    background-color: var(--hycn-color-error);
    color: white;
  }

  button[data-variant="outline"][data-color="gray"] {
    border-color: var(--hycn-color-gray);
    color: var(--hycn-color-gray);
  }

  button[data-variant="outline"][data-color="gray"]:hover:not(:disabled) {
    background-color: var(--hycn-color-gray);
    color: white;
  }

  /* Subtle variants */
  button[data-variant="subtle"][data-color="primary"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-primary) 10%,
      transparent
    );
    color: var(--hycn-color-primary);
  }

  button[data-variant="subtle"][data-color="primary"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-primary) 15%,
      transparent
    );
  }

  button[data-variant="subtle"][data-color="secondary"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 10%,
      transparent
    );
    color: var(--hycn-color-secondary);
  }

  button[data-variant="subtle"][data-color="secondary"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 15%,
      transparent
    );
  }

  button[data-variant="subtle"][data-color="success"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-success) 10%,
      transparent
    );
    color: var(--hycn-color-success);
  }

  button[data-variant="subtle"][data-color="success"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-success) 15%,
      transparent
    );
  }

  button[data-variant="subtle"][data-color="warning"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-warning) 10%,
      transparent
    );
    color: var(--hycn-color-warning);
  }

  button[data-variant="subtle"][data-color="warning"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-warning) 15%,
      transparent
    );
  }

  button[data-variant="subtle"][data-color="error"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-error) 10%,
      transparent
    );
    color: var(--hycn-color-error);
  }

  button[data-variant="subtle"][data-color="error"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-error) 15%,
      transparent
    );
  }

  button[data-variant="subtle"][data-color="gray"] {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 10%,
      transparent
    );
    color: var(--hycn-color-gray);
  }

  button[data-variant="subtle"][data-color="gray"]:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 15%,
      transparent
    );
  }

  /* Transparent variant */
  button[data-variant="transparent"] {
    color: inherit;
  }

  button[data-variant="transparent"]:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

export const component: Type["Component"] = {
  size: "md",
  variant: "outline",
  color: "primary",
  disabled: false,
  loading: false,
  fullWidth: false,
  type: "button",
  render: ({ size, variant, color, disabled, loading, fullWidth, type }) => {
    console.log("size", size, "variant", variant)
    return html`
      <button
        data-size="${size}"
        data-variant="${variant}"
        data-color="${color}"
        data-full-width="${fullWidth}"
        data-loading="${loading}"
        type="${type}"
        ?disabled=${disabled || loading}
        aria-busy=${loading}
      >
        ${loading && html`<span class="loader"></span>`}
        <span class="content ${loading ? "content-loading" : ""}">
          <slot></slot>
        </span>
      </button>
    `.style(buttonStyles)
  },
}
