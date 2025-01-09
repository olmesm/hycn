import "./index.css"
import { define, debug } from "hybrids"

if (import.meta.env.DEV) debug()

define.from(
  import.meta.glob("./components/*.tsx", {
    eager: true,
    import: "component",
  }),
  { root: "components" },
)
