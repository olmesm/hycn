import "./custom-elements.js"
import { register as registerCombobox } from "./components/hycn-combobox.js"
import { register as registerDialog } from "./components/hycn-dialog.js"
import { register as registerMenu } from "./components/hycn-menu.js"
import { register as registerTabs } from "./components/hycn-tabs.js"
import { register as registerTree } from "./components/hycn-tree.js"
import { register as registerVisuallyHidden } from "./components/hycn-visually-hidden.js"
import { register as registerSimpleCounter } from "./components/simple-counter.js"

registerVisuallyHidden()
registerSimpleCounter()
registerDialog()
registerTabs()
registerMenu()
registerCombobox()
registerTree()
