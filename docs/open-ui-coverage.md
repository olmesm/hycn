# Open UI coverage

HYCN uses the canonical component research pages in the [Open UI repository](https://github.com/openui/open-ui/tree/main/site/src/pages/components) as its implementation inventory. Explainers and alternate proposals for the same primitive do not create duplicate roadmap entries.

## Implemented

- [x] Accordion
- [x] Checkbox
- [x] Combobox
- [x] Dialog
- [x] Menu
- [x] Radio group
- [x] Slider
- [x] Switch
- [x] Tabs
- [x] Tree view (listed in the [component matrix](https://open-ui.org/research/component-matrix/))

## Interactive primitives remaining

- [ ] Carousel
- [ ] Date picker
- [ ] Disclosure
- [ ] File input
- [ ] Number input
- [ ] Popover / popup
- [ ] Select
- [ ] Toast
- [ ] Tooltip

## Structural and presentational primitives remaining

- [ ] Alert
- [ ] Avatar
- [ ] Badge
- [ ] Breadcrumb
- [ ] Button
- [ ] Card
- [ ] Flex
- [ ] Icon
- [ ] Image
- [ ] List
- [ ] Skeleton
- [ ] Table
- [ ] Tag
- [ ] Text

Each checked item requires a registered custom element, package exports and metadata, interactive documentation, browser-level behavior tests where applicable, and an accessibility check. Native HTML remains the internal baseline where it already provides the correct semantics.
