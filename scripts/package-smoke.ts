import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const smokeRoot = path.join(root, "tmp", "package-smoke")
const archiveDir = path.join(smokeRoot, "archives")
const consumerDir = path.join(smokeRoot, "consumer")
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))

function run(command: string[], cwd = root) {
	const result = Bun.spawnSync(command, { cwd, stderr: "pipe", stdout: "pipe" })
	if (result.exitCode !== 0) {
		throw new Error(
			`Command failed: ${command.join(" ")}\n${result.stdout.toString()}\n${result.stderr.toString()}`,
		)
	}
	return result.stdout.toString()
}

const requiredFiles = [
	packageJson.types,
	packageJson.customElements,
	packageJson.exports["."].import,
	packageJson.exports["./register"].import,
	"./dist/custom-elements.d.ts",
	...[
		"hycn-accordion",
		"hycn-combobox",
		"hycn-dialog",
		"hycn-menu",
		"hycn-tabs",
		"hycn-tree",
		"hycn-visually-hidden",
	].flatMap((name) => [`./dist/components/${name}.js`, `./dist/components/${name}.d.ts`]),
]

const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)))
if (missing.length > 0) throw new Error(`Package is missing:\n${missing.join("\n")}`)

const unexpected = ["./dist/index.html", "./dist/assets"].filter((file) =>
	existsSync(path.join(root, file)),
)
if (unexpected.length > 0) {
	throw new Error(`Application artifacts leaked into the library:\n${unexpected.join("\n")}`)
}

rmSync(smokeRoot, { force: true, recursive: true })
mkdirSync(archiveDir, { recursive: true })
mkdirSync(consumerDir, { recursive: true })
run(["bun", "pm", "pack", "--destination", archiveDir])

const archive = readdirSync(archiveDir).find((file) => file.endsWith(".tgz"))
if (!archive) throw new Error("bun pm pack did not create an archive")

writeFileSync(
	path.join(consumerDir, "package.json"),
	`${JSON.stringify(
		{
			name: "hycn-package-consumer",
			private: true,
			type: "module",
			dependencies: { hycn: `file:../archives/${archive}` },
		},
		null,
		2,
	)}\n`,
)
writeFileSync(
	path.join(consumerDir, "tsconfig.json"),
	`${JSON.stringify(
		{
			compilerOptions: {
				lib: ["ES2023", "DOM"],
				module: "ESNext",
				moduleResolution: "bundler",
				noEmit: true,
				strict: true,
				target: "ES2022",
			},
			include: ["consumer.ts"],
		},
		null,
		2,
	)}\n`,
)
writeFileSync(
	path.join(consumerDir, "consumer.ts"),
	`import { dialog, registerTabs } from "hycn"
import { component as directDialog } from "hycn/components/hycn-dialog"

const element = document.createElement("hycn-dialog")
element.open = true
element.close("consumer")
registerTabs()

const tags: string[] = [dialog.tag, directDialog.tag]
console.info(tags)
`,
)
writeFileSync(
	path.join(consumerDir, "browser.ts"),
	`import "hycn/register"
globalThis.hycnPackageReady = true
`,
)

run(["bun", "install"], consumerDir)
run([path.join(root, "node_modules", ".bin", "tsc"), "-p", "tsconfig.json"], consumerDir)

const installedPackage = path.join(consumerDir, "node_modules", "hycn")
const manifest = JSON.parse(
	readFileSync(path.join(installedPackage, "custom-elements.json"), "utf8"),
)
const missingManifestModules = manifest.modules
	.map(({ path: modulePath }: { path: string }) => modulePath)
	.filter((modulePath: string) => !existsSync(path.join(installedPackage, modulePath)))
if (missingManifestModules.length > 0) {
	throw new Error(`Manifest references missing modules:\n${missingManifestModules.join("\n")}`)
}

console.info(`Installed package smoke check passed (${requiredFiles.length} required files)`)
