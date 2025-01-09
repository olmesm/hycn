# 🪻 HYCN

[hybrids.js] component build system, exposed via [ladle.dev].

## Features

- [x] webcomponents via [hybrids.js]
- [x] "storybook" via [ladle.dev]
- [x] auto-generate typescript declarations for the webcomponents
- [ ] webcomponent library for import

## Workflow

**NOTE** Webcomponents [must start with a lowercase letter and contain a hyphen](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

1. Components are declared in `./src/components/<component-name>.tsx`
1. `gen-types.ts` script watches for changes and will generate the webcomponent declaration and type for the component in `src/globals.d.ts`
1. Component docs/stories are declared in `./src/stories/<component-name>.stories.tsx`

See [ladle.dev] and [hybrids.js] for more info

## Development

```bash
bun install

bun dev
```

<!-- MD REFS -->

[hybrids.js]: https://hybrids.js.org/
[ladle.dev]: https://ladle.dev/
