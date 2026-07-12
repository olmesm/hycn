import { expect, test } from "@playwright/test"

test("production component book registers and runs interactive components", async ({ page }) => {
	await page.goto("/build/?story=components--accordion--default")
	await page.getByText("Can more than one section open?", { exact: true }).click()
	await expect(
		page.locator("details").filter({ hasText: "Can more than one section open?" }),
	).toHaveAttribute("open", "")

	await page.goto("/build/?story=components--checkbox--default")
	await page.getByRole("checkbox", { name: "Email updates" }).click()
	await expect(page.getByRole("checkbox", { name: "Email updates" })).toBeChecked()

	await page.goto("/build/?story=components--popover--default")
	await page.getByRole("button", { name: "Profile" }).click()
	await expect(page.getByRole("dialog", { name: "Profile details" })).toBeVisible()

	await page.goto("/build/?story=components--inputs--default")
	await page.getByRole("textbox", { name: "Name" }).fill("Grace Hopper")
	await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Grace Hopper")
	await page.getByRole("combobox", { name: "Country" }).selectOption("es")
	await expect(page.getByRole("combobox", { name: "Country" })).toHaveValue("es")

	await page.goto("/build/?story=components--carousel--default")
	await page.getByRole("button", { name: "Next slide" }).click()
	await expect(page.getByRole("group", { name: "2 of 3" })).toBeVisible()

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
