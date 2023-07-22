// hint: in node enviroent, use 'timers/promises/setTimeout'
// eslint-disable-next-line no-promise-executor-return
import type {MutableRefObject} from 'react'

export function sleep(millisecond: number) {
	return new Promise(resolve => void setTimeout(resolve, millisecond))
}

export function cancellableSleep(millisecond: number) {
	let timeout: ReturnType<typeof setTimeout> | undefined
	// eslint-disable-next-line no-promise-executor-return
	const promise = new Promise<void>(resolve => void (timeout = setTimeout(() => {
		timeout = undefined
		resolve()
	}, millisecond)))
	return {
		promise,
		cancel() {
			if (timeout) {
				clearTimeout(timeout)
				timeout = undefined
			}
		},
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
const MAX_TIMEOUT = 2_147_483_647
// https://developer.mozilla.org/en-US/docs/Web/API/setInterval#return_value
const MAX_INTERVAL = MAX_TIMEOUT
// https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout#notes
// Passing an invalid ID to clearTimeout() silently does nothing; no exception is thrown.
const setTimeoutUntilRef = (
	cb: () => any,
	end: number,
	ref: MutableRefObject<ReturnType<typeof setTimeout>>
) => {
	const diff = end - Date.now()
	ref.current = diff <= MAX_TIMEOUT
		? setTimeout(cb, Math.max(diff, 0))
		: setTimeout(() => {
			setTimeoutUntilRef(cb, end, ref)
		}, MAX_TIMEOUT)
}

// timeout has limit of 2147483647
export function setTimeoutUntil(
	cb: () => any,
	end: number
): MutableRefObject<ReturnType<typeof setTimeout>> {
	const ref = {current: undefined as any}
	setTimeoutUntilRef(cb, end, ref)
	return ref
}

export function setTimeoutUnlimited(cb: () => any, timeout: number) {
	return setTimeoutUntil(cb, Date.now() + timeout)
}

// wait for promise to resolve or timeout
export async function timeoutWait<T, V>(
	promise: Promise<T>,
	time: number,
	fallback: V
): Promise<T | V>
export async function timeoutWait<T>(
	promise: Promise<T>,
	time: number,
): Promise<T | undefined>
export async function timeoutWait<T>(
	promise: Promise<T>,
	time: number,
	fallback = undefined,
) {
	if (time <= 0) return fallback
	const {promise: timeoutPromise, cancel} = cancellableSleep(time)
	try {
		return await Promise.race([
			promise,
			timeoutPromise.then(() => fallback),
		])
	} finally {
		cancel()
	}
}
