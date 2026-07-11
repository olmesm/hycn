export function emit<Detail>(
	host: HTMLElement,
	type: string,
	detail: Detail,
	options: { cancelable?: boolean } = {},
) {
	return host.dispatchEvent(
		new CustomEvent(type, {
			bubbles: true,
			cancelable: options.cancelable,
			composed: true,
			detail,
		}),
	)
}
