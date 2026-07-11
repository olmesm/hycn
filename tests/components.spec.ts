import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
	await page.goto("/tests/fixtures/")
})

test("definition exports do not register custom elements", async ({ page }) => {
	await page.goto("/tests/fixtures/definitions.html")
	await expect
		.poll(() =>
			page.evaluate(() => {
				const definitions = Reflect.get(globalThis, "hycnDefinitions") as Record<
					string,
					{ tag?: string }
				>
				return {
					dialogTag: definitions?.dialog?.tag,
					registered: Boolean(customElements.get("hycn-dialog")),
				}
			}),
		)
		.toEqual({ dialogTag: "hycn-dialog", registered: false })
})

test("registers every public component", async ({ page }) => {
	await expect
		.poll(() =>
			page.evaluate(() =>
				[
					"hycn-dialog",
					"hycn-tabs",
					"hycn-menu",
					"hycn-combobox",
					"hycn-tree",
					"hycn-visually-hidden",
				].every((tag) => Boolean(customElements.get(tag))),
			),
		)
		.toBe(true)
})

test("dialog manages focus, escape, and focus restoration", async ({ page }) => {
	const opener = page.getByRole("button", { name: "Open dialog" })
	await opener.click()
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeVisible()
	await expect(page.locator("#dialog-first")).toBeFocused()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeHidden()
	await expect(opener).toBeFocused()
})

test("tabs support arrow-key selection", async ({ page }) => {
	const overview = page.getByRole("tab", { name: "Overview" })
	const api = page.getByRole("tab", { name: "API" })
	await expect(overview).toHaveAttribute("aria-selected", "true")
	await overview.focus()
	await page.keyboard.press("ArrowRight")
	await expect(api).toBeFocused()
	await expect(api).toHaveAttribute("aria-selected", "true")
	await expect(page.getByRole("tabpanel", { name: "API" })).toBeVisible()
})

test("menu supports keyboard navigation and selection", async ({ page }) => {
	const trigger = page.getByRole("button", { name: "Actions" })
	await trigger.focus()
	await page.keyboard.press("ArrowDown")
	await expect(page.getByRole("menu")).toBeVisible()
	await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused()
	await page.keyboard.press("ArrowDown")
	await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeFocused()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("menu")).toBeHidden()
	await expect(trigger).toBeFocused()
})

test("combobox filters and selects with the keyboard", async ({ page }) => {
	const input = page.getByRole("combobox", { name: "Country" })
	await input.fill("spa")
	await expect(page.getByRole("option", { name: "Spain" })).toBeVisible()
	await page.keyboard.press("ArrowDown")
	await page.keyboard.press("Enter")
	await expect(input).toHaveValue("Spain")
	await expect(page.locator("hycn-combobox")).toHaveJSProperty("value", "es")
})

test("tree supports expansion, traversal, and selection", async ({ page }) => {
	const source = page.getByRole("treeitem", { name: /src/ })
	await source.focus()
	await page.keyboard.press("ArrowRight")
	await expect(source).toHaveAttribute("aria-expanded", "true")
	await page.keyboard.press("ArrowDown")
	const components = page.getByRole("treeitem", { name: "components" })
	await expect(components).toBeFocused()
	await page.keyboard.press("Enter")
	await expect(components).toHaveAttribute("aria-selected", "true")
})

test("component fixtures have no detectable accessibility violations", async ({ page }) => {
	const results = await new AxeBuilder({ page }).analyze()
	expect(results.violations).toEqual([])
})
