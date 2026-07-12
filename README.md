# 🪻 HYCN

Accessible, framework-independent Web Components built with [Hybrids](https://hybrids.js.org/).

HYCN publishes unbundled standard ES modules, TypeScript declarations, a Custom Elements Manifest, side-effect-free component definitions, and explicit registration entry points. Interactive documentation is built with [Ladle](https://ladle.dev/).

## Components

- `hycn-accordion` — progressive native disclosures with optional exclusive expansion
- `hycn-checkbox` — form-associated checkbox with indeterminate state
- `hycn-radio-group` — typed, form-associated single-choice options
- `hycn-slider` — form-associated numeric range input
- `hycn-switch` — form-associated binary switch
- `hycn-dialog` — modal focus management, cancellation, dismissal, and restoration
- `hycn-tabs` — automatic or manual activation with horizontal and vertical navigation
- `hycn-menu` — trigger coordination, popup focus, selection, and outside dismissal
- `hycn-combobox` — typed filtering, active option management, and selection
- `hycn-tree` — hierarchical expansion, traversal, and selection
- `hycn-visually-hidden` — visually hidden accessible content

`simple-counter` remains as the small Hybrids authoring example.

Coverage of the broader Open UI research inventory is tracked in [`docs/open-ui-coverage.md`](docs/open-ui-coverage.md).

## Installation

```sh
bun add hycn
```

Register every element once in an application entry point:

```ts
import "hycn/register"
```

For a smaller registration surface, import only what the application uses:

```ts
import { registerDialog, registerTabs } from "hycn"

registerDialog()
registerTabs()
```

Definitions are exported separately for advanced Hybrids composition:

```ts
import { dialog } from "hycn"

console.log(dialog.tag) // hycn-dialog
```

Individual component modules are also available:

```ts
import { component, register } from "hycn/components/hycn-combobox"
```

## Example

```html
<hycn-tabs>
  <button slot="tab" type="button">Overview</button>
  <button slot="tab" type="button">API</button>
  <section slot="panel">Overview content</section>
  <section slot="panel">API content</section>
</hycn-tabs>
```

Complex data is assigned as a property rather than serialized into attributes:

```ts
const combobox = document.querySelector("hycn-combobox")

combobox.options = [
  { label: "France", value: "fr" },
  { label: "Spain", value: "es" },
]
```

## Public API conventions

- Primitive state may be supplied through properties or documented reflected attributes.
- Structured data such as combobox options and tree items is property-only.
- Component events bubble across shadow boundaries and use the `hycn-*` prefix.
- Light-DOM composition uses named slots.
- Styling uses documented `part` names and `--hycn-*` custom properties.
- Importing `hycn` does not register elements. Import `hycn/register` or call registration functions explicitly.

The Ladle documentation includes the complete property, attribute, event, slot, part, keyboard, and accessibility contract for each component.

## Development

Install dependencies and start Ladle with the generated JSX types watcher:

```sh
bun install
bun run dev
```

Run all checks:

```sh
bun run check
```

Useful focused commands:

```sh
bun run check:lint
bun run check:types
bun run check:package
bun run check:test
bun run build
```

Playwright exercises the public DOM interface in Chromium, Firefox, and WebKit. The suite covers registration, keyboard navigation, focus behavior, state reflection, selection, and automated axe accessibility analysis.

## Publishing model

`bun run build:library` emits unbundled ESM, declarations, declaration maps, and source maps into `dist/`. The build intentionally leaves bundling and minification to the consuming application, following [Open Web Components publishing guidance](https://open-wc.org/guides/developing-components/publishing/).

The package remains marked `private` until its final registry name and release policy are chosen. Remove that flag only as part of an intentional release.
