# Mantine-Hybrids Component Library Research

## Executive Summary

This research analyzes the feasibility of creating a web component library using hybrids.js to match the core components available in Mantine. The analysis covers hybrids.js capabilities, Mantine's component structure, and implementation patterns suitable for building a comprehensive component library.

## Hybrids.js Framework Analysis

### Core Capabilities

**Philosophy**: Hybrids.js (v9.1.18) uses functional programming paradigms with pure functions and plain objects, avoiding class-based inheritance patterns common in other web component frameworks.

**Key Strengths for Component Libraries**:
- Zero dependencies, minimal bundle size
- Functional composition over inheritance
- Native-like HTML binding without special syntax
- Built-in smart caching and change detection
- TypeScript support with type generation
- Hot Module Replacement support

### Component Definition Pattern
```javascript
import { html, define } from "hybrids";

export default define({
  tag: "my-component",
  // Properties with reactive descriptors
  propName: defaultValue,
  // Render function with template literals
  render: ({ propName }) => html`
    <element onclick="${handler}">${propName}</element>
  `,
});
```

### Property System
- **Reactive Properties**: Automatic dependency tracking and updates
- **Property Factories**: Reusable descriptor patterns
- **Lifecycle Management**: Connect/disconnect through property descriptors

### Event Handling
- Host-centric approach: `(host, event) => void`
- Direct state manipulation through host object
- Support for custom events with dispatch helper

### Styling Approaches
- Class binding: string, array, or object syntax
- Dynamic style binding with CSS-in-JS objects
- Shadow DOM and Light DOM support
- Built-in layout engine for CSS encapsulation

## Mantine Core Components Analysis

### Component Categories Suitable for Implementation

#### 1. Core UI Components (High Priority)
**Buttons**:
- Button (primary, outline, subtle, transparent variants)
- ActionIcon (icon-only button)
- UnstyledButton (base styling)
- CloseButton (standardized close)

**Inputs**:
- TextInput, Textarea
- Checkbox, Radio, Switch
- Select, NumberInput, PasswordInput

#### 2. Layout Components (High Priority)
**Container & Spacing**:
- Container (max-width wrapper)
- Box (generic container)
- Space (spacing utility)
- Divider (visual separator)

**Flexbox Layouts**:
- Stack (vertical flex)
- Group (horizontal flex)
- Flex (full flex control)
- Center (centering utility)

**Grid System**:
- Grid (CSS Grid)
- SimpleGrid (equal-width responsive)

#### 3. Feedback Components (Medium Priority)
**Status Indicators**:
- Alert (messages with variants)
- Badge (labels and status)
- Loader (loading indicators)
- Progress (progress bars)
- Skeleton (loading placeholders)

#### 4. Data Display (Medium Priority)
**Typography**:
- Text, Title, Code, Mark, Blockquote

**Media & Content**:
- Image, Avatar, Card, Paper

#### 5. Navigation Components (Lower Priority)
- Tabs, Breadcrumbs, Anchor, Pagination

### Common Mantine Patterns
- Consistent size system: xs, sm, md, lg, xl
- Variant system: filled, outline, subtle, transparent
- Color theming with CSS variables
- Styles API for deep customization
- Accessibility with ARIA attributes

## Component Mapping Analysis

### Hybrids.js → Mantine Implementation Strategy

#### 1. Property Mapping
**Mantine Props → Hybrids Properties**:
```javascript
// Mantine: <Button size="lg" variant="outline" color="blue" />
// Hybrids equivalent:
export default define({
  tag: "hycn-button",
  size: "md",           // xs|sm|md|lg|xl
  variant: "filled",    // filled|outline|subtle|transparent
  color: "blue",        // theme colors
  disabled: false,
  loading: false,
  render: ({ size, variant, color, disabled, loading }) => html`...`
});
```

#### 2. Event Handling Translation
```javascript
// Mantine: onClick prop
// Hybrids: onclick template binding
render: () => html`
  <button onclick="${(host, event) => host.dispatchEvent(new CustomEvent('click', { detail: event }))}">
    <slot></slot>
  </button>
`
```

#### 3. Styling System Adaptation
```javascript
// CSS-in-JS style generation based on props
const getButtonStyles = (size, variant, color) => ({
  padding: sizeMap[size],
  backgroundColor: variant === 'filled' ? `var(--color-${color})` : 'transparent',
  border: variant === 'outline' ? `1px solid var(--color-${color})` : 'none',
  // ... more styles
});

render: ({ size, variant, color }) => html`
  <button style="${getButtonStyles(size, variant, color)}">
    <slot></slot>
  </button>
`
```

#### 4. Theming Integration
```javascript
// CSS custom properties for theming
const themeProperties = {
  '--color-primary': '#228be6',
  '--color-secondary': '#868e96',
  '--radius-sm': '0.25rem',
  '--spacing-md': '1rem',
  // ... theme values
};
```

### Technical Challenges and Solutions

#### 1. **CSS-in-JS vs Template Literals**
- **Challenge**: Mantine uses emotion for CSS-in-JS
- **Solution**: Create style helper functions that return CSS objects for hybrids.js style binding

#### 2. **Component Composition**
- **Challenge**: Complex components with multiple sub-components
- **Solution**: Use hybrids.js composition patterns and slot-based content projection

#### 3. **Theming System**
- **Challenge**: Mantine's comprehensive theming
- **Solution**: CSS custom properties with JavaScript theme management

#### 4. **TypeScript Integration**
- **Challenge**: Auto-generated types for web components
- **Solution**: Leverage existing `gen-types.ts` script, extend for comprehensive prop types

## Implementation Recommendations

### Phase 1: Foundation (Core UI)
1. **Button components** (Button, ActionIcon, CloseButton)
2. **Basic inputs** (TextInput, Checkbox, Radio, Switch)
3. **Layout basics** (Container, Box, Stack, Group)

### Phase 2: Data Display & Feedback
1. **Typography** (Text, Title, Code)
2. **Status indicators** (Alert, Badge, Loader)
3. **Content containers** (Card, Paper)

### Phase 3: Advanced Layout & Navigation
1. **Grid system** (Grid, SimpleGrid)
2. **Navigation** (Tabs, Breadcrumbs)
3. **Complex inputs** (Select, NumberInput, PasswordInput)

### Development Strategy
1. **Component Base Class**: Create reusable property factories for common patterns
2. **Theme System**: Establish CSS custom property system matching Mantine's approach
3. **Type Generation**: Extend existing type generation for comprehensive TypeScript support
4. **Testing Strategy**: Use existing ladle.dev setup for component documentation and testing
5. **Build Process**: Integrate with existing build system for component library distribution

## Conclusion

The combination of hybrids.js functional approach and Mantine's comprehensive component design creates an excellent foundation for a modern web component library. The functional paradigms of hybrids.js align well with creating reusable, composable UI components, while Mantine's mature design system provides proven patterns for component APIs and styling.

**Key Success Factors**:
- Leverage hybrids.js functional composition for clean, maintainable components
- Adapt Mantine's prop patterns to hybrids.js property system
- Implement comprehensive theming with CSS custom properties
- Use existing tooling (ladle.dev, type generation) for development workflow
- Focus on core components first, avoiding complex advanced components

This approach should result in a lightweight, functional web component library that matches Mantine's usability while leveraging the unique benefits of hybrids.js architecture.