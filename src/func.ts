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

export interface IChainable<Params extends any[] = any, Result = any> {
	(next: () => any, ...params: Params): Result
}

type ChainResult<P> = P extends [infer F1, ...any[]]
	? F1 extends IChainable<infer Params, infer R>
		? (...params: Params) => R
		: never
	: () => void
// f1 => (...p1) => f1(noop, ...p1)
// (f2, f1) => (...p2) => f2((...p1) => f1(noop, ...p1), ...p2)
// (f3, f2, f1) => (...p3) => f3((...p2) => f2((...p1) => f1(noop, ...p1), ...p2), ...p3)
export function chain<P extends IChainable[]>(...fs: P): ChainResult<P> {
	return fs.reduceRight(
		(acc, cur) => <P1 extends any[]>(...params: P1) => cur(acc as <T>() => T, ...params),
		noop
	)
}
