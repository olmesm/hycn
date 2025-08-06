import type { Story, Meta } from "@ladle/react"
import "../components/hycn-button"
import "../components/hycn-action-icon"
import "../components/hycn-close-button"
import "../components/hycn-unstyled-button"
import "../main"

export default {
  title: "Hycn Button",
} satisfies Meta

export const HycnButton: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <h2>hycn-button</h2>

    <div>
      <h3>Variants</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-button variant="filled">Filled</hycn-button>
        <hycn-button variant="outline">Outline</hycn-button>
        <hycn-button variant="subtle">Subtle</hycn-button>
        <hycn-button variant="transparent">Transparent</hycn-button>
      </div>
    </div>

    <div>
      <h3>Colors</h3>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <hycn-button color="primary">Primary</hycn-button>
        <hycn-button color="secondary">Secondary</hycn-button>
        <hycn-button color="success">Success</hycn-button>
        <hycn-button color="warning">Warning</hycn-button>
        <hycn-button color="error">Error</hycn-button>
        <hycn-button color="gray">Gray</hycn-button>
      </div>
    </div>

    <div>
      <h3>Sizes</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-button size="xs">Extra Small</hycn-button>
        <hycn-button size="sm">Small</hycn-button>
        <hycn-button size="md">Medium</hycn-button>
        <hycn-button size="lg">Large</hycn-button>
        <hycn-button size="xl">Extra Large</hycn-button>
      </div>
    </div>

    <div>
      <h3>States</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-button>Normal</hycn-button>
        <hycn-button disabled>Disabled</hycn-button>
        <hycn-button loading>Loading</hycn-button>
      </div>
    </div>

    <div>
      <h3>Full Width</h3>
      <hycn-button full-width>Full Width Button</hycn-button>
    </div>

    <div>
      <h3>Button Types</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-button type="button">Button</hycn-button>
        <hycn-button type="submit" color="success">
          Submit
        </hycn-button>
        <hycn-button type="reset" color="error">
          Reset
        </hycn-button>
      </div>
    </div>
  </div>
)

export const HycnActionIcon: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <h2>hycn-action-icon</h2>

    <div>
      <h3>Variants</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-action-icon variant="filled">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon variant="outline">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon variant="subtle">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon variant="transparent">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </hycn-action-icon>
      </div>
    </div>

    <div>
      <h3>Sizes</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-action-icon size="xs">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 0 .5H11.534l2.33 2.33a.25.25 0 1 1-.354.354L11.184 8.5H.5a.5.5 0 0 1 0-1h10.684l2.326-2.33a.25.25 0 0 1 .354.354L11.534 7z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon size="sm">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 0 .5H11.534l2.33 2.33a.25.25 0 1 1-.354.354L11.184 8.5H.5a.5.5 0 0 1 0-1h10.684l2.326-2.33a.25.25 0 0 1 .354.354L11.534 7z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon size="md">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 0 .5H11.534l2.33 2.33a.25.25 0 1 1-.354.354L11.184 8.5H.5a.5.5 0 0 1 0-1h10.684l2.326-2.33a.25.25 0 0 1 .354.354L11.534 7z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon size="lg">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 0 .5H11.534l2.33 2.33a.25.25 0 1 1-.354.354L11.184 8.5H.5a.5.5 0 0 1 0-1h10.684l2.326-2.33a.25.25 0 0 1 .354.354L11.534 7z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon size="xl">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 0 .5H11.534l2.33 2.33a.25.25 0 1 1-.354.354L11.184 8.5H.5a.5.5 0 0 1 0-1h10.684l2.326-2.33a.25.25 0 0 1 .354.354L11.534 7z" />
          </svg>
        </hycn-action-icon>
      </div>
    </div>

    <div>
      <h3>States</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-action-icon>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon disabled>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          </svg>
        </hycn-action-icon>
        <hycn-action-icon loading>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          </svg>
        </hycn-action-icon>
      </div>
    </div>
  </div>
)

export const HycnCloseButton: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <h2>hycn-close-button</h2>

    <div>
      <h3>Variants</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-close-button variant="filled" />
        <hycn-close-button variant="outline" />
        <hycn-close-button variant="subtle" />
        <hycn-close-button variant="transparent" />
      </div>
    </div>

    <div>
      <h3>Sizes</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-close-button size="xs" />
        <hycn-close-button size="sm" />
        <hycn-close-button size="md" />
        <hycn-close-button size="lg" />
        <hycn-close-button size="xl" />
      </div>
    </div>

    <div>
      <h3>Custom Icon Size</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-close-button icon-size="24" />
        <hycn-close-button icon-size="32" />
      </div>
    </div>

    <div>
      <h3>States</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-close-button />
        <hycn-close-button disabled />
      </div>
    </div>
  </div>
)

export const HycnUnstyledButton: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <h2>hycn-unstyled-button</h2>

    <div>
      <h3>Basic Usage</h3>
      <p>
        Base button without any default styling - perfect for custom designs:
      </p>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <hycn-unstyled-button>Unstyled Button</hycn-unstyled-button>
        <hycn-unstyled-button disabled>Disabled Unstyled</hycn-unstyled-button>
      </div>
    </div>

    <div>
      <h3>With Custom Styling</h3>
      <hycn-unstyled-button
        style={{
          padding: "12px 24px",
          backgroundColor: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        Custom Styled Button
      </hycn-unstyled-button>
    </div>
  </div>
)
