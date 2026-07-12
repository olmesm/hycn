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

test("installed package registration works in a browser", async ({ page }) => {
	await page.goto("/tests/fixtures/package.html")
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					Reflect.get(globalThis, "hycnPackageReady") === true &&
					Boolean(customElements.get("hycn-dialog")),
			),
		)
		.toBe(true)
})

test("registers every public component", async ({ page }) => {
	await expect
		.poll(() =>
			page.evaluate(() =>
				[
					"hycn-accordion",
					"hycn-checkbox",
					"hycn-dialog",
					"hycn-tabs",
					"hycn-menu",
					"hycn-radio-group",
					"hycn-slider",
					"hycn-switch",
					"hycn-combobox",
					"hycn-tree",
					"hycn-visually-hidden",
				].every((tag) => Boolean(customElements.get(tag))),
			),
		)
		.toBe(true)
})

test("form controls submit, validate, emit changes, and reset", async ({ page }) => {
	const checkbox = page.getByRole("checkbox", { name: "Email updates" })
	const switchControl = page.getByRole("switch", { name: "Dark mode" })
	const medium = page.getByRole("radio", { name: "Medium" })
	const slider = page.getByRole("slider", { name: "Volume" })

	await checkbox.click()
	await switchControl.click()
	await medium.click()
	await slider.focus()
	await page.keyboard.press("ArrowRight")

	await expect(checkbox).toBeChecked()
	await expect(switchControl).toBeChecked()
	await expect(medium).toBeChecked()
	await expect(slider).toHaveValue("41")
	await expect
		.poll(() =>
			page
				.locator("#control-form")
				.evaluate((form: HTMLFormElement) => Object.fromEntries(new FormData(form))),
		)
		.toEqual({ size: "m", theme: "dark", updates: "yes", volume: "41" })

	await page.getByRole("button", { name: "Reset controls" }).click()
	await expect(checkbox).not.toBeChecked()
	await expect(switchControl).not.toBeChecked()
	await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked()
	await expect(slider).toHaveValue("40")
})

test("accordion coordinates exclusive disclosure state and emits toggle details", async ({
	page,
}) => {
	const accordion = page.locator("hycn-accordion")
	const first = accordion.locator("details").filter({ hasText: "First question" })
	const second = accordion.locator("details").filter({ hasText: "Second question" })
	await accordion.evaluate((element) => {
		Reflect.set(globalThis, "accordionToggleDetails", [])
		element.addEventListener("hycn-toggle", (event) => {
			Reflect.get(globalThis, "accordionToggleDetails").push((event as CustomEvent).detail)
		})
	})

	await page.getByText("Second question", { exact: true }).click()
	await expect(second).toHaveAttribute("open", "")
	await expect(first).not.toHaveAttribute("open")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "accordionToggleDetails")))
		.toContainEqual({ expanded: true, index: 1 })

	await page.getByText("Second question", { exact: true }).click()
	await expect(second).not.toHaveAttribute("open")
	await accordion.evaluate((element: HTMLElementTagNameMap["hycn-accordion"]) => {
		element.collapsible = false
	})
	await expect(first).toHaveAttribute("open", "")
	await page.getByText("First question", { exact: true }).click()
	await expect(first).toHaveAttribute("open", "")
})

test("accordion roves focus across enabled summaries", async ({ page }) => {
	const first = page.getByText("First question", { exact: true })
	const second = page.getByText("Second question", { exact: true })
	const disabled = page.getByText("Disabled question", { exact: true })

	await first.focus()
	await page.keyboard.press("ArrowDown")
	await expect(second).toBeFocused()
	await page.keyboard.press("ArrowDown")
	await expect(first).toBeFocused()
	await page.keyboard.press("End")
	await expect(second).toBeFocused()
	await expect(disabled).toHaveAttribute("aria-disabled", "true")
})

test("dialog manages focus, wraps composed focus, and restores the opener", async ({ page }) => {
	const opener = page.getByRole("button", { name: "Open dialog" })
	await opener.click()
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeVisible()
	await expect(page.locator("#dialog-first")).toBeFocused()
	await page.keyboard.press("Shift+Tab")
	await expect(page.getByRole("button", { name: "Nested action" })).toBeFocused()
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeHidden()
	await expect(opener).toBeFocused()
})

test("dialog cancellation is preventable and includes a reason", async ({ page }) => {
	const dialog = page.locator("hycn-dialog")
	await page.getByRole("button", { name: "Open dialog" }).click()
	await dialog.evaluate((element) => {
		element.addEventListener(
			"hycn-cancel",
			(event) => {
				Reflect.set(globalThis, "dialogCancelDetail", (event as CustomEvent).detail)
				event.preventDefault()
			},
			{ once: true },
		)
	})
	await page.keyboard.press("Escape")
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeVisible()
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "dialogCancelDetail")))
		.toEqual({
			reason: "escape",
		})
})

test("dialog restores inert state when modal changes or disconnects", async ({ page }) => {
	const opener = page.getByRole("button", { name: "Open dialog" })
	const dialog = page.locator("hycn-dialog")
	await opener.click()
	await expect(opener).toHaveJSProperty("inert", true)
	await dialog.evaluate((element: HTMLElementTagNameMap["hycn-dialog"]) => {
		element.modal = false
	})
	await expect(opener).toHaveJSProperty("inert", false)
	await dialog.evaluate((element: HTMLElementTagNameMap["hycn-dialog"]) => {
		element.modal = true
	})
	await expect(opener).toHaveJSProperty("inert", true)
	await dialog.evaluate((element) => element.remove())
	await expect(opener).toHaveJSProperty("inert", false)
})

test("dialog isolates stacked modals across shadow roots and tracks new siblings", async ({
	page,
}) => {
	await page.evaluate(async () => {
		const outside = document.createElement("button")
		outside.id = "shadow-outside"
		outside.textContent = "Shadow outside"
		document.body.append(outside)

		const container = document.createElement("div")
		container.id = "shadow-container"
		const root = container.attachShadow({ mode: "open" })
		root.innerHTML = `
			<button id="shadow-peer">Shadow peer</button>
			<hycn-dialog label="Shadow dialog"><button>Shadow action</button></hycn-dialog>
		`
		document.body.append(container)
		await customElements.whenDefined("hycn-dialog")
		const dialog = root.querySelector<HTMLElementTagNameMap["hycn-dialog"]>("hycn-dialog")
		if (dialog) dialog.open = true
	})

	await expect(page.locator("#shadow-outside")).toHaveJSProperty("inert", true)
	await expect(page.locator("#shadow-container").locator("#shadow-peer")).toHaveJSProperty(
		"inert",
		true,
	)

	await page.evaluate(() => {
		const root = document.querySelector("#shadow-container")?.shadowRoot
		const newPeer = document.createElement("button")
		newPeer.id = "new-shadow-peer"
		newPeer.textContent = "New shadow peer"
		root?.append(newPeer)
	})
	await expect(page.locator("#shadow-container").locator("#new-shadow-peer")).toHaveJSProperty(
		"inert",
		true,
	)

	await page.evaluate(() => {
		const second = document.createElement("hycn-dialog")
		second.id = "stacked-dialog"
		second.label = "Stacked dialog"
		second.innerHTML = '<button type="button">Stacked action</button>'
		document.body.append(second)
		second.open = true
	})
	await expect(page.locator("#shadow-container")).toHaveJSProperty("inert", true)
	await page
		.locator("#stacked-dialog")
		.evaluate((element: HTMLElementTagNameMap["hycn-dialog"]) => {
			element.close("test")
		})
	await expect(page.locator("#shadow-container")).toHaveJSProperty("inert", false)
	await expect(page.locator("#shadow-outside")).toHaveJSProperty("inert", true)

	await page
		.locator("#shadow-container")
		.locator("hycn-dialog")
		.evaluate((element: HTMLElementTagNameMap["hycn-dialog"]) => element.close("test"))
	await expect(page.locator("#shadow-outside")).toHaveJSProperty("inert", false)
})

test("non-modal dialog does not block pointer or focus interaction outside", async ({ page }) => {
	const dialog = page.locator("hycn-dialog")
	const outside = page.getByRole("button", { name: "Outside target" })
	await dialog.evaluate((element: HTMLElementTagNameMap["hycn-dialog"]) => {
		element.modal = false
		element.open = true
	})
	await expect(page.getByRole("dialog", { name: "Account settings" })).toBeVisible()
	await expect(outside).toHaveJSProperty("inert", false)
	await outside.click()
	await expect(outside).toBeFocused()
	await expect(dialog).toHaveAttribute("open", "")
})

test("dialog supports backdrop dismissal and reflected open state", async ({ page }) => {
	const host = page.locator("hycn-dialog")
	await page.getByRole("button", { name: "Open dialog" }).click()
	await expect(host).toHaveAttribute("open", "")
	await host.locator("[part='backdrop']").click({ position: { x: 5, y: 5 } })
	await expect(host).not.toHaveAttribute("open", "")
})

test("tabs preserve disabled positional pairing and skip disabled tabs", async ({ page }) => {
	const overview = page.getByRole("tab", { name: "Overview" })
	const disabled = page.getByRole("tab", { name: "Disabled" })
	const api = page.getByRole("tab", { name: "API" })
	await expect(disabled).toHaveAttribute("aria-disabled", "true")
	await expect(page.getByText("Disabled panel", { exact: true })).toBeHidden()
	await overview.focus()
	await page.keyboard.press("ArrowRight")
	await expect(api).toBeFocused()
	await expect(api).toHaveAttribute("aria-selected", "true")
	await expect(page.getByRole("tabpanel", { name: "API" })).toBeVisible()
	await expect(page.getByRole("tabpanel", { name: "Overview" })).toBeHidden()
	await expect(page.locator("hycn-tabs")).toHaveAttribute("selected-index", "2")
})

test("tabs support vertical manual activation and change events", async ({ page }) => {
	const tabs = page.locator("hycn-tabs")
	await tabs.evaluate((element: HTMLElementTagNameMap["hycn-tabs"]) => {
		element.activation = "manual"
		element.orientation = "vertical"
		element.addEventListener("hycn-change", (event) => {
			Reflect.set(globalThis, "tabsChangeDetail", (event as CustomEvent).detail)
		})
	})
	const overview = page.getByRole("tab", { name: "Overview" })
	const api = page.getByRole("tab", { name: "API" })
	await overview.focus()
	await page.keyboard.press("ArrowDown")
	await expect(api).toBeFocused()
	await expect(overview).toHaveAttribute("aria-selected", "true")
	await page.keyboard.press("Enter")
	await expect(api).toHaveAttribute("aria-selected", "true")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "tabsChangeDetail")))
		.toEqual({
			index: 2,
		})
})

test("tabs react when disabled state changes after slot assignment", async ({ page }) => {
	const host = page.locator("hycn-tabs")
	const overview = page.getByRole("tab", { name: "Overview" })
	const api = page.getByRole("tab", { name: "API" })
	await api.click()
	await expect(api).toHaveAttribute("aria-selected", "true")
	await api.evaluate((element: HTMLButtonElement) => {
		element.disabled = true
	})
	await expect(overview).toHaveAttribute("aria-selected", "true")
	await expect(overview).toHaveAttribute("tabindex", "0")
	await expect(host).toHaveAttribute("selected-index", "0")
	await api.evaluate((element: HTMLButtonElement) => {
		element.disabled = false
	})
	await expect(api).not.toHaveAttribute("aria-disabled")
})

test("menu handles disabled and generic items with keyboard selection", async ({ page }) => {
	const menu = page.locator("hycn-menu")
	await menu.evaluate((element) => {
		element.addEventListener("hycn-select", (event) => {
			Reflect.set(globalThis, "menuSelectDetail", (event as CustomEvent).detail)
		})
	})
	const trigger = page.getByRole("button", { name: "Actions" })
	await trigger.focus()
	await page.keyboard.press("ArrowDown")
	await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused()
	await page.keyboard.press("ArrowDown")
	await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeFocused()
	await expect(page.getByRole("menuitem", { name: "Disabled action" })).toHaveAttribute(
		"aria-disabled",
		"true",
	)
	await expect(page.getByRole("separator")).toHaveAttribute("tabindex", "-1")
	await page.keyboard.press("Enter")
	await expect(page.getByRole("menu")).toBeHidden()
	await expect(trigger).toBeFocused()
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "menuSelectDetail")))
		.toEqual({
			value: "duplicate",
		})
	await expect(trigger).not.toHaveAttribute("aria-controls")
})

test("menu closes on its backdrop and when focus leaves", async ({ page }) => {
	const menu = page.locator("hycn-menu")
	const trigger = page.getByRole("button", { name: "Actions" })
	await trigger.click()
	await expect(menu).toHaveAttribute("open", "")
	await menu.locator("[part='backdrop']").click({ position: { x: 2, y: 2 } })
	await expect(menu).not.toHaveAttribute("open", "")
	await trigger.focus()
	await page.keyboard.press("ArrowDown")
	await page.keyboard.press("Tab")
	await expect(page.getByRole("menu")).toBeHidden()
})

test("combobox filters, emits input, and selects with the keyboard", async ({ page }) => {
	const host = page.locator("hycn-combobox")
	await host.evaluate((element) => {
		element.addEventListener("hycn-input", (event) => {
			Reflect.set(globalThis, "comboboxInputDetail", (event as CustomEvent).detail)
		})
		element.addEventListener("hycn-change", (event) => {
			Reflect.set(globalThis, "comboboxChangeDetail", (event as CustomEvent).detail)
		})
	})
	const input = page.getByRole("combobox", { name: "Country" })
	await input.fill("spa")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "comboboxInputDetail")))
		.toEqual({
			query: "spa",
		})
	await page.keyboard.press("ArrowDown")
	await page.keyboard.press("Enter")
	await expect(input).toHaveValue("Spain")
	await expect(host).toHaveJSProperty("value", "es")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "comboboxChangeDetail")))
		.toEqual({
			label: "Spain",
			value: "es",
		})
})

test("combobox closes on blur and never exposes a dangling active descendant", async ({ page }) => {
	const host = page.locator("hycn-combobox")
	const input = page.getByRole("combobox", { name: "Country" })
	await input.focus()
	await expect(input).toHaveAttribute("aria-expanded", "true")
	await page.getByRole("button", { name: "Outside target" }).focus()
	await expect(input).toHaveAttribute("aria-expanded", "false")
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.query = "missing"
		element.open = true
		element.options = [{ label: "Another", value: "another" }]
	})
	await expect(input).not.toHaveAttribute("aria-activedescendant")
})

test("combobox synchronizes displayed text when value changes externally", async ({ page }) => {
	const host = page.locator("hycn-combobox")
	const input = page.getByRole("combobox", { name: "Country" })
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.value = "fr"
	})
	await expect(input).toHaveValue("France")
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.value = "es"
	})
	await expect(input).toHaveValue("Spain")
})

test("combobox reconciles a controlled value when asynchronous options arrive or change", async ({
	page,
}) => {
	const host = page.locator("hycn-combobox")
	const input = page.getByRole("combobox", { name: "Country" })
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.options = []
		element.value = "fr"
	})
	await expect(input).toHaveValue("")
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.options = [{ label: "France", value: "fr" }]
	})
	await expect(input).toHaveValue("France")
	await host.evaluate((element: HTMLElementTagNameMap["hycn-combobox"]) => {
		element.options = [{ label: "French Republic", value: "fr" }]
	})
	await expect(input).toHaveValue("French Republic")
})

test("tree supports expansion, traversal, selection, and event payloads", async ({ page }) => {
	const tree = page.locator("hycn-tree")
	await tree.evaluate((element) => {
		element.addEventListener("hycn-change", (event) => {
			Reflect.set(globalThis, "treeChangeDetail", (event as CustomEvent).detail)
		})
	})
	const source = page.getByRole("treeitem", { name: /src/ })
	await source.focus()
	await page.keyboard.press("ArrowRight")
	await expect(source).toHaveAttribute("aria-expanded", "true")
	await page.keyboard.press("ArrowDown")
	const components = page.getByRole("treeitem", { name: "components" })
	await expect(components).toBeFocused()
	await page.keyboard.press("Enter")
	await expect(components).toHaveAttribute("aria-selected", "true")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "treeChangeDetail")))
		.toEqual({
			id: "components",
			label: "components",
		})
})

test("tree restores a tab stop when an active branch collapses or data changes", async ({
	page,
}) => {
	const tree = page.locator("hycn-tree")
	const source = page.getByRole("treeitem", { name: /src/ })
	await source.focus()
	await page.keyboard.press("ArrowRight")
	await page.keyboard.press("ArrowDown")
	await expect(page.getByRole("treeitem", { name: "components" })).toBeFocused()
	await tree.evaluate((element: HTMLElementTagNameMap["hycn-tree"]) => {
		element.expanded = []
	})
	await expect(tree.locator("[role='treeitem'][tabindex='0']")).toHaveCount(1)
	await expect(source).toHaveAttribute("tabindex", "0")
	await tree.evaluate((element: HTMLElementTagNameMap["hycn-tree"]) => {
		element.items = [{ id: "new", label: "New root" }]
	})
	await expect(tree.locator("[role='treeitem'][tabindex='0']")).toHaveCount(1)
	await expect(page.getByRole("treeitem", { name: "New root" })).toHaveAttribute("tabindex", "0")
})

test("tree prevents default browser behavior for handled horizontal keys", async ({ page }) => {
	const tree = page.locator("hycn-tree")
	await tree.evaluate((element) => {
		element.addEventListener("keydown", (event) => {
			if (event.key === "ArrowRight")
				Reflect.set(globalThis, "treeHorizontalPrevented", event.defaultPrevented)
		})
	})
	await page.getByRole("treeitem", { name: /src/ }).focus()
	await page.keyboard.press("ArrowRight")
	await expect
		.poll(() => page.evaluate(() => Reflect.get(globalThis, "treeHorizontalPrevented")))
		.toBe(true)
})

test("component fixtures have no detectable accessibility violations", async ({ page }) => {
	const results = await new AxeBuilder({ page }).analyze()
	expect(results.violations).toEqual([])
})

test("component documentation fixture has a stable visual baseline", async ({
	browserName,
	page,
}) => {
	test.skip(browserName !== "chromium", "Visual baseline runs once in Chromium")
	await page.setViewportSize({ width: 900, height: 900 })
	await expect(page.locator("main")).toHaveScreenshot("component-fixtures.png", {
		animations: "disabled",
		caret: "hide",
		maxDiffPixelRatio: 0.08,
	})
})
