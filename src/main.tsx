import "./index.css"
import { debug } from "hybrids"
import "./register"

if (import.meta.env.DEV) {
	debug()

	console.info("HYCN components registered")
}
