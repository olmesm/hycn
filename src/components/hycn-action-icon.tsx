import { html } from "hybrids"
import { DefineComponent } from "../utils/types"
import { css } from "../utils/string-utils"

export type Type = DefineComponent<{
  size: "xs" | "sm" | "md" | "lg" | "xl"
  variant: "filled" | "outline" | "subtle" | "transparent"
  color: "primary" | "secondary" | "success" | "warning" | "error" | "gray"
  disabled: boolean
  loading: boolean
  type: "button" | "submit" | "reset"
}>

const actionIconStyles = css`
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

  .loading {
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

  /* Variants */
  .variant-filled.color-primary {
    background-color: var(--hycn-color-primary);
    color: white;
  }
  .variant-filled.color-primary:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-primary) 90%, black);
  }
  .variant-filled.color-secondary {
    background-color: var(--hycn-color-secondary);
    color: white;
  }
  .variant-filled.color-secondary:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 90%,
      black
    );
  }
  .variant-filled.color-success {
    background-color: var(--hycn-color-success);
    color: white;
  }
  .variant-filled.color-success:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-success) 90%, black);
  }
  .variant-filled.color-warning {
    background-color: var(--hycn-color-warning);
    color: #000;
  }
  .variant-filled.color-warning:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-warning) 90%, black);
  }
  .variant-filled.color-error {
    background-color: var(--hycn-color-error);
    color: white;
  }
  .variant-filled.color-error:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-error) 90%, black);
  }
  .variant-filled.color-gray {
    background-color: var(--hycn-color-gray);
    color: white;
  }
  .variant-filled.color-gray:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--hycn-color-gray) 90%, black);
  }

  .variant-outline.color-primary {
    border-color: var(--hycn-color-primary);
    color: var(--hycn-color-primary);
  }
  .variant-outline.color-primary:hover:not(:disabled) {
    background-color: var(--hycn-color-primary);
    color: white;
  }
  .variant-outline.color-secondary {
    border-color: var(--hycn-color-secondary);
    color: var(--hycn-color-secondary);
  }
  .variant-outline.color-secondary:hover:not(:disabled) {
    background-color: var(--hycn-color-secondary);
    color: white;
  }
  .variant-outline.color-success {
    border-color: var(--hycn-color-success);
    color: var(--hycn-color-success);
  }
  .variant-outline.color-success:hover:not(:disabled) {
    background-color: var(--hycn-color-success);
    color: white;
  }
  .variant-outline.color-warning {
    border-color: var(--hycn-color-warning);
    color: var(--hycn-color-warning);
  }
  .variant-outline.color-warning:hover:not(:disabled) {
    background-color: var(--hycn-color-warning);
    color: #000;
  }
  .variant-outline.color-error {
    border-color: var(--hycn-color-error);
    color: var(--hycn-color-error);
  }
  .variant-outline.color-error:hover:not(:disabled) {
    background-color: var(--hycn-color-error);
    color: white;
  }
  .variant-outline.color-gray {
    border-color: var(--hycn-color-gray);
    color: var(--hycn-color-gray);
  }
  .variant-outline.color-gray:hover:not(:disabled) {
    background-color: var(--hycn-color-gray);
    color: white;
  }

  .variant-subtle.color-primary {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-primary) 10%,
      transparent
    );
    color: var(--hycn-color-primary);
  }
  .variant-subtle.color-primary:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-primary) 15%,
      transparent
    );
  }
  .variant-subtle.color-secondary {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 10%,
      transparent
    );
    color: var(--hycn-color-secondary);
  }
  .variant-subtle.color-secondary:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-secondary) 15%,
      transparent
    );
  }
  .variant-subtle.color-success {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-success) 10%,
      transparent
    );
    color: var(--hycn-color-success);
  }
  .variant-subtle.color-success:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-success) 15%,
      transparent
    );
  }
  .variant-subtle.color-warning {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-warning) 10%,
      transparent
    );
    color: var(--hycn-color-warning);
  }
  .variant-subtle.color-warning:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-warning) 15%,
      transparent
    );
  }
  .variant-subtle.color-error {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-error) 10%,
      transparent
    );
    color: var(--hycn-color-error);
  }
  .variant-subtle.color-error:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-error) 15%,
      transparent
    );
  }
  .variant-subtle.color-gray {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 10%,
      transparent
    );
    color: var(--hycn-color-gray);
  }
  .variant-subtle.color-gray:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--hycn-color-gray) 15%,
      transparent
    );
  }

  .variant-transparent {
    color: inherit;
  }
  .variant-transparent:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

export const component: Type["Component"] = {
  size: "md",
  variant: "subtle",
  color: "gray",
  disabled: false,
  loading: false,
  type: "button",
  render: ({ size, variant, color, disabled, loading, type }) => {
    const classes = [
      `size-${size}`,
      `variant-${variant}`,
      `color-${color}`,
      loading && "loading",
    ]
      .filter(Boolean)
      .join(" ")

    return html`
      <button
        class="${classes}"
        type="${type}"
        ${(disabled || loading) ? "disabled" : ""}
        aria-busy=${loading}
      >
        ${loading && html`<span class="loader"></span>`}
        <span class="content ${loading ? "content-loading" : ""}">
          <slot></slot>
        </span>
      </button>
    `.style(actionIconStyles)
  },
}
