import "./index.css"
import { define, debug } from "hybrids"

if (import.meta.env.DEV) {
  debug()

  console.info(
    "Components",
    import.meta.glob(["./components/**/*.tsx"], {
      eager: true,
      import: "component",
    }),
  )
}

define.from(
  import.meta.glob(["./components/**/*.tsx"], {
    eager: true,
    import: "component",
  }),
  { root: "components" },
)
