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
	"hycn-alert": {
		description: "An assertive or polite live-region alert.",
		members: [field("tone", '"assertive" | "polite"')],
		slots: [slot("", "Alert content.")],
		cssParts: [part("base", "Alert container.")],
	},
	"hycn-avatar": {
		description: "A person or entity image with an initials fallback.",
		members: [field("src", "string"), field("alt", "string"), field("initials", "string")],
		slots: [slot("", "Fallback content.")],
		cssParts: [
			part("base", "Avatar frame."),
			part("image", "Avatar image."),
			part("fallback", "Fallback content."),
		],
	},
	"hycn-badge": {
		description: "A compact status or count label.",
		slots: [slot("", "Badge content.")],
		cssParts: [part("base", "Badge surface.")],
	},
	"hycn-breadcrumb": {
		description: "A labelled breadcrumb navigation landmark.",
		members: [field("label", "string", "label", '"Breadcrumb"')],
		slots: [slot("", "Breadcrumb links and separators.")],
		cssParts: [part("base", "Navigation landmark.")],
	},
	"hycn-button": {
		description: "A native button wrapper.",
		members: [
			field("disabled", "boolean", "disabled", "false"),
			field("type", '"button" | "reset" | "submit"', "type", '"button"'),
		],
		slots: [slot("", "Button label.")],
		cssParts: [part("base", "Native button.")],
	},
	"hycn-card": {
		description: "A grouped article surface.",
		slots: [slot("", "Card content.")],
		cssParts: [part("base", "Card article.")],
	},
	"hycn-carousel": {
		description: "A labelled carousel with previous and next controls.",
		members: [
			field("selectedIndex", "number", "selected-index", "0"),
			field("loop", "boolean", "loop", "false"),
			field("label", "string", "label", '"Carousel"'),
		],
		events: [event("hycn-change", "{ index: number }", "Emitted after slide selection changes.")],
		slots: [slot("slide", "Carousel slides.")],
		cssParts: [
			part("base", "Carousel region."),
			part("slides", "Slide viewport."),
			part("controls", "Navigation controls."),
			part("previous", "Previous button."),
			part("next", "Next button."),
		],
	},
	"hycn-date-picker": {
		description: "A form-associated native date picker.",
		members: [
			field("value", "string", "value", '""'),
			field("min", "string", "min", '""'),
			field("max", "string", "max", '""'),
			field("label", "string", "label", '"Date"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
		],
		events: [event("hycn-change", "{ value: string }", "Emitted when the date changes.")],
		cssParts: [
			part("label", "Label wrapper."),
			part("text", "Label text."),
			part("control", "Native date input."),
		],
	},
	"hycn-file-input": {
		description: "A form-associated native file chooser.",
		members: [
			field("accept", "string", "accept", '""'),
			field("multiple", "boolean", "multiple", "false"),
			field("label", "string", "label", '"Choose a file"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
			field("files", "FileList | null"),
		],
		events: [
			event("hycn-change", "{ files: FileList | null }", "Emitted when selected files change."),
		],
		cssParts: [
			part("label", "Label wrapper."),
			part("text", "Label text."),
			part("control", "Native file input."),
		],
	},
	"hycn-flex": {
		description: "A configurable flex layout primitive.",
		members: [
			field("direction", '"column" | "row"'),
			field("gap", "string"),
			field("align", "string"),
			field("justify", "string"),
			field("wrap", "boolean", "wrap", "false"),
		],
		slots: [slot("", "Flex items.")],
		cssParts: [part("base", "Flex container.")],
	},
	"hycn-icon": {
		description: "A decorative or labelled icon container.",
		members: [field("label", "string", "label", '""')],
		slots: [slot("", "Icon graphic.")],
		cssParts: [part("base", "Icon container.")],
	},
	"hycn-image": {
		description: "A responsive native image wrapper.",
		members: [
			field("src", "string", "src", '""'),
			field("alt", "string", "alt", '""'),
			field("loading", '"eager" | "lazy"', "loading", '"lazy"'),
			field("width", "number", "width", "0"),
			field("height", "number", "height", "0"),
		],
		cssParts: [part("image", "Native image.")],
	},
	"hycn-list": {
		description: "An ordered or unordered semantic list.",
		members: [field("ordered", "boolean", "ordered", "false")],
		slots: [slot("", "List items.")],
		cssParts: [part("base", "Native list.")],
	},
	"hycn-number-input": {
		description: "A form-associated native number input.",
		members: [
			field("value", "number", "value", "0"),
			field("min", "number", "min"),
			field("max", "number", "max"),
			field("step", "number", "step", "1"),
			field("label", "string", "label", '"Number"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
		],
		events: [
			event("hycn-input", "{ value: number }", "Emitted during input."),
			event("hycn-change", "{ value: number }", "Emitted after commitment."),
		],
		cssParts: [
			part("label", "Label wrapper."),
			part("text", "Label text."),
			part("control", "Native number input."),
		],
	},
	"hycn-select": {
		description: "A form-associated single-choice native select.",
		members: [
			field("options", "SelectOption[]"),
			field("value", "string", "value", '""'),
			field("placeholder", "string", "placeholder", '""'),
			field("label", "string", "label", '"Choose an option"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
		],
		events: [event("hycn-change", "{ value: string }", "Emitted when selection changes.")],
		cssParts: [
			part("label", "Label wrapper."),
			part("text", "Label text."),
			part("control", "Native select."),
		],
	},
	"hycn-skeleton": {
		description: "A reduced-motion-aware loading placeholder.",
		members: [field("label", "string", "label", '"Loading"')],
		cssParts: [part("base", "Placeholder surface.")],
	},
	"hycn-table": {
		description: "A labelled scroll container for a semantic table.",
		members: [field("label", "string", "label", '""')],
		slots: [slot("", "A native table.")],
		cssParts: [part("base", "Scrollable table region.")],
	},
	"hycn-tag": {
		description: "A compact categorical label.",
		slots: [slot("", "Tag content.")],
		cssParts: [part("base", "Tag surface.")],
	},
	"hycn-text": {
		description: "An inline text styling primitive.",
		members: [
			field("muted", "boolean", "muted", "false"),
			field("weight", '"bold" | "normal"', "weight", '"normal"'),
		],
		slots: [slot("", "Text content.")],
		cssParts: [part("base", "Text span.")],
	},
	"hycn-text-input": {
		description: "A form-associated native text input.",
		members: [
			field("value", "string", "value", '""'),
			field("type", '"email" | "password" | "search" | "tel" | "text" | "url"', "type", '"text"'),
			field("placeholder", "string", "placeholder", '""'),
			field("label", "string", "label", '"Text"'),
			field("disabled", "boolean", "disabled", "false"),
			field("required", "boolean", "required", "false"),
		],
		events: [
			event("hycn-input", "{ value: string }", "Emitted during input."),
			event("hycn-change", "{ value: string }", "Emitted after commitment."),
		],
		cssParts: [
			part("label", "Label wrapper."),
			part("text", "Label text."),
			part("control", "Native text input."),
		],
	},
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
	"hycn-disclosure": {
		description: "A button-controlled disclosure panel.",
		members: [
			field("open", "boolean", "open", "false"),
			field("disabled", "boolean", "disabled", "false"),
			field("label", "string", "label", '"Details"'),
		],
		events: [
			event("hycn-toggle", "{ expanded: boolean }", "Emitted after disclosure state changes."),
		],
		slots: [slot("trigger", "Disclosure button content."), slot("", "Expandable panel content.")],
		cssParts: [part("trigger", "Disclosure button."), part("panel", "Expandable content panel.")],
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
	"hycn-popover": {
		description: "A generic trigger-controlled anchored popup.",
		members: [
			field("open", "boolean", "open", "false"),
			field("label", "string", "label", '"Popover"'),
		],
		events: [event("hycn-toggle", "{ open: boolean }", "Emitted after popup state changes.")],
		slots: [slot("trigger", "Popup trigger."), slot("", "Popup content.")],
		cssParts: [
			part("trigger", "Trigger wrapper."),
			part("backdrop", "Outside dismissal surface."),
			part("popup", "Popup surface."),
		],
		cssProperties: [
			cssProperty("--hycn-popover-background", "Popup background."),
			cssProperty("--hycn-popover-border", "Popup border color."),
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
	"hycn-toast": {
		description: "A live-region notification queue.",
		members: [
			field("messages", "ToastMessage[]", undefined, "[]"),
			field("duration", "number", undefined, "5000"),
			{
				kind: "method",
				name: "show",
				parameters: [
					{ name: "message", type: { text: "string" } },
					{ name: "tone", optional: true, type: { text: '"assertive" | "polite"' } },
				],
				return: { type: { text: "string" } },
			},
			{
				kind: "method",
				name: "dismiss",
				parameters: [{ name: "id", type: { text: "string" } }],
				return: { type: { text: "void" } },
			},
		],
		events: [event("hycn-dismiss", "{ id: string }", "Emitted when a notification is dismissed.")],
		cssParts: [
			part("region", "Notification stack."),
			part("toast", "Notification surface."),
			part("message", "Notification message."),
			part("dismiss", "Dismiss button."),
		],
		cssProperties: [
			cssProperty("--hycn-toast-background", "Notification background."),
			cssProperty("--hycn-toast-z-index", "Notification stack level."),
		],
	},
	"hycn-tooltip": {
		description: "A delayed hover and focus description.",
		members: [
			field("open", "boolean", "open", "false"),
			field("delay", "number", undefined, "300"),
		],
		slots: [slot("trigger", "Element described by the tooltip."), slot("", "Tooltip content.")],
		cssParts: [part("trigger", "Trigger wrapper."), part("tooltip", "Tooltip surface.")],
		cssProperties: [
			cssProperty("--hycn-tooltip-background", "Tooltip background."),
			cssProperty("--hycn-tooltip-color", "Tooltip foreground."),
		],
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
