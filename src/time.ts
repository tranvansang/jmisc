// eslint-disable-next-line no-promise-executor-return

// hint: in node enviroent, use 'timers/promises/setTimeout'
export function sleep(millisecond: number) {
	return new Promise(resolve => void setTimeout(resolve, millisecond))
}

// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
const MAX_TIMEOUT = 2_147_483_647
// https://developer.mozilla.org/en-US/docs/Web/API/setInterval#return_value
const MAX_INTERVAL = MAX_TIMEOUT
// https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes
// Passing an invalid ID to clearTimeout() silently does nothing; no exception is thrown.
// timeout has limit of 2147483647
export function setTimeoutUntil(
	cb: () => any,
	until: number
) {
	let timeout: ReturnType<typeof setTimeout> | undefined

	const sub = (
		cb: () => any,
		until: number,
	) => {
		const diff = until - Date.now()
		if (diff <= MAX_TIMEOUT) {
			timeout = setTimeout(cb, Math.max(diff, 0))
		} else {
			timeout = setTimeout(() => {
				sub(cb, until)
			}, MAX_TIMEOUT)
		}
	}
	sub(cb, until)
	return () => {
		if (timeout) clearTimeout(timeout)
		timeout = undefined
	}
}
