import {Promisable} from './type'

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

// export function chain(): undefined // noop()
// export function chain<R1, P1 extends any[]>(
// 	f1: (next: () => void, ...p: P1) => R1,
// ): (...p: P1) => R1 // (...p1) => f1(noop, ...p1)
// export function chain<R2, P2 extends any[], R1, P1 extends any[]>(
// 	f2: (next: (...p: P1) => R1, ...p: P2) => R2,
// 	f1: (next: () => void, ...p: P1) => R1,
// ): (...p: P2) => R2 // (...p2) => f2((...p1) => f1(noop, ...p1), ...p2)
// export function chain<R3, P3 extends any[], R2, P2 extends any[], R1, P1 extends any[]>(
// 	f3: (next: (...p: P2) => R2, ...p: P3) => R3,
// 	f2: (next: (...p: P1) => R1, ...p: P2) => R2,
// 	f1: (next: () => void, ...p: P1) => R1,
// ): (...p: P3) => R3 // (...p3) => f3((...p2) => f2((...p1) => f1(noop, ...p1), ...p2), ...p3)

// type Chain<P extends (<V>(next: <T>() => T) => () => V)[], R = void> = P extends [...infer Rest, infer F1]
// type Chain<F, R = void> = F extends [infer F1, ...infer Rest]
// 	? F1 extends (
// 			next: (...p: infer NP) => infer NR,
// 			...p: infer P1
// 		) => infer R1
// 		? [F1, ...Chain<Rest, R1>]
// 		: never
// 	: []
// type Chain<F, NP extends any[] = [], NR = void> = F extends [...infer Rest, infer F1]
// 	? F1 extends (
// 			next: (...p: NP) => NR,
// 			...p: infer P1
// 		) => infer R1
// 		? [...Chain<Rest, P1, R1>, F1]
// 		: never
// 	: []
type ChainResult<P> = P extends [infer F1, ...any[]]
	? F1 extends (next: () => any, ...params: infer Params) => infer R
		? (...params: Params) => R
		: never
	: void
export function chain<P extends any[]>(...fs: P): ChainResult<P> {
	return fs.reduceRight(
		(acc, cur) => <P1 extends any[]>(...params: P1) => cur(acc as <T>() => T, ...params),
		noop
	)
}

type Dechain<F, NP extends any[] = [], NR = void> = F extends [infer F1, ...infer Rest]
	? F1 extends (
			next: (...p: NP) => NR,
			...p: infer P1
		) => infer R1
		? Dechain<Rest, P1, R1>
		: never
	: (...p: NP) => NR
// export function dechain(...fs) {
// 	return fs.reduce(
// 		(acc, cur) => <P1 extends any[]>(...params: P1) => cur(acc, ...params),
// 		noop
// 	)
// }
// export function dechain(): undefined // noop()
// export function dechain<R1, P1 extends any[]>(
// 	f1: (next: () => void, ...p: P1) => R1,
// ): (...p: P1) => R1 // (...p1) => f1(noop, ...p1)
export function dechain<R1, P1 extends any[], R2, P2 extends any[]>(
	f1: (next: () => void, ...p: P1) => R1,
	f2: (next: (...p: P1) => R1, ...p: P2) => R2,
): (...p: P2) => R2 // (...p2) => f2((...p1) => f1(noop, ...p1), ...p2)
// export function dechain<R1, P1 extends any[], R2, P2 extends any[], R3, P3 extends any[]>(
// 	f1: (next: () => void, ...p: P1) => R1,
// 	f2: (next: (...p: P1) => R1, ...p: P2) => R2,
// 	f3: (next: (...p: P2) => R2, ...p: P3) => R3,
// ): (...p: P3) => R3 // (...p3) => f3((...p2) => f2((...p1) => f1(noop, ...p1), ...p2), ...p3)

// const a = dechain()
// const b = dechain(
// 	(next) => {
// 		return 10
// 	}
// )
const c = dechain(
	(next, x: string) => {
		next()
		return 10
	},
	(next, y: 10) => {
		const d = next(1)
		return 'a'
	},
)
// cannot pass params to the next chain
// can get the returned value of the next chain (next())
// noop()
// f1(noop)()
// f2(f1(noop))()
// f3(f2(f1(noop)))()
// f4(f3(f2(f1(noop))))()
