# HYCN - Web Components Build System

A [hybrids.js] component build system with [ladle.dev] for component documentation/stories.

## Project Structure

- **Components**: `./src/components/<component-name>.tsx` - Web components using hybrids.js
- **Stories**: `./src/stories/<component-name>.stories.tsx` - Component documentation via ladle
- **Types**: `src/globals.d.ts` - Auto-generated TypeScript declarations for web components
- **Utils**: `src/utils/` - Shared utilities (string-utils.ts, types.ts)

## Development Commands

```bash
bun dev           # Start development (runs ladle serve + type generation watcher)
bun build         # Build types and storybook
bun fmt           # Format code with Prettier
bun lint          # Lint code with ESLint
```

## Key Technologies

- **hybrids.js**: Web component library
- **ladle.dev**: Component documentation/storybook alternative
- **TypeScript**: Type generation via `scripts/ts/gen-types.ts`
- **Bun**: Package manager and runtime

## Important Notes

- Web components must start with lowercase letter and contain a hyphen
- Type generation script watches for changes and updates `src/globals.d.ts`
- Components are automatically registered as web components
- We need to always import the main.tsx file in a story
