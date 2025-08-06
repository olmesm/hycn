import type { Story } from "@ladle/react"
import "../main"

export const SimpleCounter: Story = () => <simple-counter count={42} />
SimpleCounter.storyName = "default"
