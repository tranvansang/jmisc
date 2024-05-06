import type {Except, Get} from 'type-fest'

// [] => true
// primitive (string, number, bigint, boolean, null, undefined) => false
// object => true
// function => true
export function isObject(obj: any) {
	return obj === Object(obj)
}

function recursiveSet<T, P extends string>(obj: T, [path, ...paths]: P[], val: any): T {
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

export function deepHas<T, P extends string>(obj: T, path?: P): boolean {
	if (path === undefined) return true // empty path. object always includes itself
	for (
		const k of path.split('.')
		) if (isObject(obj) && k in <any>obj) obj = obj[k]
	else return false
	return true
}

export function get<T, P extends string>(obj: T, path?: P): Get<T, P> {
	if (path === undefined) return obj as any
	for (
		const k of path.split('.')
	) if (isObject(obj) && k in <any>obj) obj = obj[k]
	else return undefined as any
	return obj as any
}

export function set<T, P extends string>(obj: T, path: P | undefined, val: Get<T, P>): T {
	if (path === undefined) return val
	return recursiveSet(obj, path.split('.'), val)
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
