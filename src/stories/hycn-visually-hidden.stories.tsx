import type { Story } from "@ladle/react"
import "../main"

export const VisuallyHidden: Story = () => (
  <>
    <hycn-visually-hidden>This should not be visible!</hycn-visually-hidden>
    <p>This should be visible!</p>
  </>
)
