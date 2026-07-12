type ApiItem = Record<string, unknown>

export interface MemberItem extends ApiItem {
	attributeName?: string
}

export interface ComponentMetadata {
	cssParts?: ApiItem[]
	cssProperties?: ApiItem[]
	description: string
	events?: ApiItem[]
	members?: MemberItem[]
	slots?: ApiItem[]
}

const field = (name: string, type: string, attribute?: string, defaultValue?: string) => ({
	attributeName: attribute,
	default: defaultValue,
	kind: "field",
	name,
	type: { text: type },
})

const event = (name: string, detail: string, description: string) => ({
	description,
	name,
	type: { text: `CustomEvent<${detail}>` },
})

const part = (name: string, description: string) => ({ description, name })
const slot = (name: string, description: string) => ({ description, name })
const cssProperty = (name: string, description: string) => ({ description, name })

export const componentMetadata: Record<string, ComponentMetadata> = {
	"hycn-accordion": {
		description: "A group of native disclosure widgets with optional exclusive expansion.",
		members: [
			field("exclusive", "boolean", "exclusive", "false"),
			field("collapsible", "boolean", "collapsible", "true"),
		],
		events: [
			event(
				"hycn-toggle",
				"{ expanded: boolean; index: number }",
				"Emitted after a direct child disclosure changes state.",
			),
		],
		slots: [slot("", "Direct child details disclosure elements.")],
		cssProperties: [cssProperty("--hycn-accordion-border", "Divider color between items.")],
	},
	"hycn-checkbox": {
		description: "A form-associated checkbox with checked and indeterminate states.",
		members: [
			field("checked", "boolean", "checked", "false"),
			field("indeterminate", "boolean", "indeterminate", "false"),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
			field("value", "string", "value", '"on"'),
			field("label", "string", "label", '"Checkbox"'),
		],
		events: [
			event(
				"hycn-change",
				"{ checked: boolean; value: string }",
				"Emitted when checked state changes.",
			),
		],
		slots: [slot("", "Checkbox label content.")],
		cssParts: [
			part("control", "Native checkbox input."),
			part("label", "Label wrapper."),
			part("text", "Label text."),
		],
	},
	"hycn-radio-group": {
		description: "A form-associated single-choice radio group.",
		members: [
			field("options", "RadioOption[]", undefined, "[]"),
			field("value", "string", "value", '""'),
			field("label", "string", "label", '"Choose an option"'),
			field("orientation", '"horizontal" | "vertical"', "orientation", '"vertical"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
		],
		events: [event("hycn-change", "{ value: string }", "Emitted when the selected value changes.")],
		cssParts: [
			part("group", "Radio fieldset."),
			part("label", "Group legend."),
			part("option", "Option label."),
		],
	},
	"hycn-slider": {
		description: "A form-associated numeric range control.",
		members: [
			field("value", "number", "value", "0"),
			field("min", "number", "min", "0"),
			field("max", "number", "max", "100"),
			field("step", "number", "step", "1"),
			field("disabled", "boolean", "disabled", "false"),
			field("label", "string", "label", '"Value"'),
		],
		events: [
			event("hycn-input", "{ value: number }", "Emitted during value input."),
			event("hycn-change", "{ value: number }", "Emitted after value commitment."),
		],
		slots: [slot("", "Slider label content.")],
		cssParts: [
			part("control", "Native range input."),
			part("label", "Label wrapper."),
			part("output", "Current value output."),
			part("text", "Label text."),
		],
	},
	"hycn-switch": {
		description: "A form-associated binary switch.",
		members: [
			field("checked", "boolean", "checked", "false"),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
			field("value", "string", "value", '"on"'),
			field("label", "string", "label", '"Switch"'),
		],
		events: [
			event(
				"hycn-change",
				"{ checked: boolean; value: string }",
				"Emitted when switch state changes.",
			),
		],
		slots: [slot("", "Switch label content.")],
		cssParts: [
			part("control", "Native checkbox with switch role."),
			part("label", "Label wrapper."),
			part("text", "Label text."),
		],
	},
	"hycn-combobox": {
		description: "An editable combobox with filtered listbox options and keyboard selection.",
		members: [
			field("options", "ComboboxOption[]", undefined, "[]"),
			field("value", "string", "value", '""'),
			field("query", "string", undefined, '""'),
			field("label", "string", "label", '"Choose an option"'),
			field("placeholder", "string", "placeholder", '""'),
			field("disabled", "boolean", "disabled", "false"),
			field("open", "boolean", "open", "false"),
		],
		events: [
			event("hycn-input", "{ query: string }", "Emitted when the editable query changes."),
			event(
				"hycn-change",
				"{ label: string; value: string }",
				"Emitted after an option is selected.",
			),
		],
		cssParts: [
			part("base", "Root layout container."),
			part("input", "Native combobox input."),
			part("listbox", "Popup listbox."),
			part("option", "An option row."),
			part("empty", "Empty-results message."),
		],
		cssProperties: [cssProperty("--hycn-combobox-background", "Listbox background color.")],
	},
	"hycn-dialog": {
		description: "A modal or non-modal dialog with focus containment and restoration.",
		members: [
			field("open", "boolean", "open", "false"),
			field("modal", "boolean", undefined, "true"),
			field("label", "string", "label", '"Dialog"'),
			field("closeOnBackdrop", "boolean", undefined, "true"),
			{
				kind: "method",
				name: "close",
				parameters: [{ name: "reason", optional: true, type: { text: "string" } }],
				return: { type: { text: "void" } },
			},
		],
		events: [
			event(
				"hycn-cancel",
				"{ reason: string }",
				"Cancelable event emitted before Escape dismissal.",
			),
			event("hycn-close", "{ reason: string }", "Emitted after the dialog closes."),
		],
		slots: [slot("", "Dialog content.")],
		cssParts: [part("backdrop", "Viewport backdrop."), part("panel", "Dialog surface.")],
		cssProperties: [
			cssProperty("--hycn-dialog-background", "Panel background."),
			cssProperty("--hycn-dialog-color", "Panel foreground."),
			cssProperty("--hycn-dialog-gutter", "Minimum viewport gutter."),
			cssProperty("--hycn-dialog-padding", "Panel padding."),
			cssProperty("--hycn-dialog-radius", "Panel corner radius."),
			cssProperty("--hycn-dialog-z-index", "Backdrop stacking level."),
		],
	},
	"hycn-menu": {
		description: "A trigger-controlled popup menu with managed keyboard focus.",
		members: [
			field("open", "boolean", "open", "false"),
			field("label", "string", "label", '"Menu"'),
		],
		events: [event("hycn-select", "{ value: string }", "Emitted when a menu item is selected.")],
		slots: [slot("trigger", "Button that controls the menu."), slot("", "Menu items.")],
		cssParts: [
			part("trigger", "Trigger positioning wrapper."),
			part("backdrop", "Outside-interaction dismissal surface."),
			part("menu", "Popup menu surface."),
		],
		cssProperties: [
			cssProperty("--hycn-menu-background", "Popup background."),
			cssProperty("--hycn-menu-border", "Popup border color."),
			cssProperty("--hycn-menu-radius", "Popup corner radius."),
			cssProperty("--hycn-menu-z-index", "Popup stacking level."),
		],
	},
	"hycn-tabs": {
		description: "A slotted tabs interface with roving focus and automatic or manual activation.",
		members: [
			field("selectedIndex", "number", "selected-index", "0"),
			field("orientation", '"horizontal" | "vertical"', "orientation", '"horizontal"'),
			field("activation", '"automatic" | "manual"', "activation", '"automatic"'),
		],
		events: [event("hycn-change", "{ index: number }", "Emitted after user-driven tab selection.")],
		slots: [slot("tab", "Tab controls."), slot("panel", "Panels paired by DOM order.")],
		cssParts: [part("tablist", "ARIA tablist container."), part("panels", "Panel container.")],
	},
	"hycn-tree": {
		description: "A hierarchical tree with expansion, selection, and roving keyboard focus.",
		members: [
			field("items", "TreeItem[]", undefined, "[]"),
			field("expanded", "string[]", undefined, "[]"),
			field("selectedId", "string", "selected-id", '""'),
			field("label", "string", "label", '"Tree"'),
		],
		events: [
			event("hycn-toggle", "{ expanded: boolean; id: string }", "Emitted when a branch changes."),
			event("hycn-change", "{ id: string; label: string }", "Emitted when a node is selected."),
		],
		cssParts: [
			part("tree", "ARIA tree container."),
			part("item", "A visible tree item."),
			part("toggle", "Branch expansion control."),
			part("spacer", "Leaf alignment spacer."),
			part("label", "Tree item label."),
		],
	},
	"hycn-visually-hidden": {
		description:
			"Visually hides slotted content while keeping it available to assistive technology.",
		slots: [slot("", "Accessible-only content.")],
	},
	"simple-counter": {
		description: "A minimal stateful counter used as a Hybrids authoring example.",
		members: [field("count", "number", "count", "0")],
	},
}
