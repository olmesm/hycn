import { expect, test } from "@playwright/test"

test("production component book registers and runs interactive components", async ({ page }) => {
	await page.goto("/build/?story=components--dialog--default")

	await expect
		.poll(() => page.evaluate(() => Boolean(customElements.get("hycn-dialog"))))
		.toBe(true)

	await page.getByRole("button", { name: "Open dialog" }).click()
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeVisible()

	await page.goto("/build/?story=components--menu--default")
	await page.getByRole("button", { name: "Actions" }).click()
	await expect(page.getByRole("menuitem", { name: "Rename" })).toBeVisible()

	await page.goto("/build/?story=components--tabs--default")
	await page.getByRole("tab", { name: "API" }).click()
	await expect(
		page.getByText("Properties, events, slots, parts, and keyboard behavior."),
	).toBeVisible()

	await page.goto("/build/?story=components--combobox--default")
	await page.getByRole("combobox", { name: "Country" }).fill("Spa")
	await expect(page.getByRole("option", { name: "Spain" })).toBeVisible()
})
