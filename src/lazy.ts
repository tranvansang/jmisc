import {Promisable} from './type.js'

// https://github.com/then/is-promise/blob/ec9bd8a3f576324a1343069a2d6c2fa35a623939/index.js
function isPromise(obj) {
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function makeLazy<T, W extends Promisable<T>>(func: () => W, retries = 0): () => W {
	let maybePromise: W | undefined
	const clearPromise = () => {
		if (retries !== 0) {
			maybePromise = undefined
			// negative retries means infinite retries
			if (retries > 0) retries--
		}
	}
	return () => {
		try {
			// this process is to make sync call to be sync
			// eslint-disable-next-line no-cond-assign
			return maybePromise ?? (isPromise(maybePromise = func())
				? maybePromise = (async () => {
					try {
						return await maybePromise
					} catch (e) {
						clearPromise()
						throw e
					}
				})() as unknown as W
				: maybePromise)
		} catch (e) {
			clearPromise()
			throw e
		}
	}
	/**
	 * if func always returns a promise
	return maybePromise ??= (
		async () => {
			try {
				return await func()
			} catch (e) {
				throwError(e)
			}
		}
	)()
	 **/
}
export function makeMemoize<Params extends any[],
	Result,
	Key>(
	func: (...params: Params) => Result,
	capacity: number,
	serializer: (...params: Params) => Key = (...params) => params[0] as Key
): typeof func {
	const memoizedResults = new Map<Key, Result>()
	return (...params) => {
		const key = serializer(...params)
		if (memoizedResults.has(key)) return memoizedResults.get(key)!
		if (memoizedResults.size === capacity) memoizedResults.delete(
			memoizedResults.keys()
				.next()
				.value
		)
		const memoizedResult = func(...params)
		memoizedResults.set(key, memoizedResult)
		return memoizedResult
	}
}
export function makeLazySync<T>(func: () => T): () => T {
	let value: T
	return () => value ??= func()
}
