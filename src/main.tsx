import "./index.css"
import { define, debug } from "hybrids"

define.from(
  import.meta.glob("./components/*.tsx", {
    eager: true,
    import: "komponent",
  }),
  { root: "components" },
)

if (import.meta.env.DEV) debug()
