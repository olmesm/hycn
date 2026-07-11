import os from "node:os"
import { defineConfig, devices } from "@playwright/test"

const macOsMajor = Number(os.release().split(".")[0])
const supportsWebkit = process.platform !== "darwin" || macOsMajor >= 24

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
	snapshotPathTemplate: "{testDir}/snapshots/{arg}-{platform}{ext}",
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
	},
	webServer: {
		command: "bun run check:package && bunx vite --host 127.0.0.1 --port 4173",
		reuseExistingServer: !process.env.CI,
		url: "http://127.0.0.1:4173/tests/fixtures/",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
		...(supportsWebkit ? [{ name: "webkit", use: { ...devices["Desktop Safari"] } }] : []),
	],
})
