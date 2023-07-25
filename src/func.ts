export function negate <Params extends any[], Result>(
	f: (...params: Params) => Result
) {
	return (...params: Params) => !f(...params)
}
export function identity<T>(x: T) {
	return x
}
export function noop() {}
export function not<T extends boolean>(b: T): T extends true ? false : true {
	return (!b) as T extends true ? false : true
}
