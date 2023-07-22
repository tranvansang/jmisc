export function as<T>(value: T): T {
	return value
}

export type IgnoreLastIfVoid<T> = T extends [...infer Rest, infer A]
	? A extends void
		? IgnoreLastIfVoid<Rest>
		: T
	: T
export type UndefinedToNull<T, Keys extends keyof T = keyof T> = {
	[k in Keys]: undefined extends T[k] ? Exclude<T[k], undefined> | null : T[k]
}
export type Nullable<T> = {
	[k in keyof T]: T[k] | null
}
// https://stackoverflow.com/a/50375286/1398479
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never // https://github.com/sindresorhus/type-fest/blob/76c08c203c8eee3bdc217236fe6f5fe4e4a1f8e8/source/require-all-or-none.d.ts#L32
export type AllOrNone<T, Keys extends keyof T = keyof T> = Required<Pick<T, Keys>> | Partial<Record<Keys, never>>
export type Promisable<T> = T | PromiseLike<T>;
