# HYCN

[hybrids.js](https://hybrids.js.org/) component build system.

1. Components are declared in `./src/components/<component-name>.tsx`

   - the `gen-types.ts` script watches for changes and will generate the webcomponent declaration and type for the component in `src/globals.d.ts`
   - **!!** Webcomponents [must start with a lowercase letter and contain a hyphen](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

1. Component docs/stories are declared in `./src/stories/<component-name>.stories.tsx`

## Development

```bash
bun install

bun dev
```
