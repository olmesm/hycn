import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
const requiredFiles = [
	packageJson.types,
	packageJson.customElements,
	packageJson.exports["."].import,
	packageJson.exports["./register"].import,
	"./dist/custom-elements.d.ts",
	...[
		"hycn-combobox",
		"hycn-dialog",
		"hycn-menu",
		"hycn-tabs",
		"hycn-tree",
		"hycn-visually-hidden",
	].flatMap((name) => [`./dist/components/${name}.js`, `./dist/components/${name}.d.ts`]),
]

const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)))
if (missing.length > 0) {
	throw new Error(`Package is missing:\n${missing.join("\n")}`)
}

const unexpected = ["./dist/index.html", "./dist/assets"].filter((file) =>
	existsSync(path.join(root, file)),
)
if (unexpected.length > 0) {
	throw new Error(`Application artifacts leaked into the library:\n${unexpected.join("\n")}`)
}

console.info(`Package smoke check passed (${requiredFiles.length} required files)`)
