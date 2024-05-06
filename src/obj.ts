import type {Except, Get} from 'type-fest'

// [] => true
// primitive (string, number, bigint, boolean, null, undefined) => false
// object => true
// function => true
export function isObject(obj: any) {
	return obj === Object(obj)
}

export function recursiveSet<T, P extends string>(obj: T, [path, ...paths]: P[], val: any): T {
	if (path === undefined) return val
	if (Array.isArray(obj)) {
		const clone: any = [...obj]
		clone[path] = recursiveSet(clone[path], paths, val)
		return clone
	}
	return {
		...obj,
		[path]: recursiveSet((obj as any)[path], paths, val)
	}
}

export function deepHas<T, P extends string>(obj: T, path: P): boolean {
	for (
		const k of path.split('.')
		) if (isObject(obj) && k in <any>obj) obj = obj[k]
	else return false
	return true
}

export function get<T, P extends string>(obj: T, path: P): Get<T, P> {
	for (
		const k of path.split('.')
	) if (isObject(obj) && k in <any>obj) obj = obj[k]
	else return undefined as any
	return obj as any
}

export function set<T, P extends string>(obj: T, path: P, val: Get<T, P>): T {
	return recursiveSet(obj, path.split('.'), val)
}

// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
// https://stackoverflow.com/questions/47057649/typescript-string-dot-notation-of-nested-object
type Join<K, P> = K extends string | number ?
	P extends string | number ?
		`${K}${'' extends P ? '' : '.'}${P}`
		: never : never
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
	11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]
type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
	{
		[K in keyof T]-?: K extends string | number ?
		`${K}` | Join<K, Paths<T[K], Prev[D]>>
		: never
	}[keyof T] : ''
type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
	{ [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : ''
type DeepPick<T, K extends string> = {
	[P in K]: Get<T, P>
}

export function deepPick<V, T extends string>(obj: V, keys: readonly T[]): DeepPick<V, T> {
	return Object.fromEntries(
		keys.filter(key => isObject(obj) && key in <any>obj)
			.map(key => [key, get(obj, key)])
	) as any
}

export function pick<V, T extends keyof V>(obj: V, ...keys: readonly T[]): Pick<V, T> {
	return Object.fromEntries(
		keys.filter(key => isObject(obj) && key in <any>obj)
			.map(key => [key, obj[key]])
	) as any
}

export function omit<V, T extends keyof V>(obj: V, ...keys: readonly T[]): Except<V, T> {
	return Object.fromEntries(
		Object.keys(obj).filter(key => !keys.includes(key as any))
			.map(key => [key, obj[key]])
	) as any
}

export function pluck<V, T extends keyof V>(obj: V[], key: T): V[T][] {
	return obj.map(o => o[key])
}

export function objectMap<V, T extends keyof V, P>(obj: V, map: (value: V[T]) => P): Record<T, P> {
	return Object.fromEntries(
		Object.entries(obj)
			.map(([k, v]) => [k, map(v)])
	) as any
}

export const emptyArray = []
export const emptyObject = {}

export function* zip<T extends Iterable<any>>(
	...iterables: T[]
) {
	const iterators = iterables.map(iterable => iterable[Symbol.iterator]())
	while (true) {
		const results = iterators.map(iterator => iterator.next())
		if (results.some(result => result.done)) break
		yield results.map(result => result.value)
	}
}
