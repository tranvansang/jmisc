declare namespace Lib {
	type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
	type DeepWriteable<T> = {-readonly [P in keyof T]: DeepWriteable<T[P]>}
	type Cast<X, Y> = X extends Y ? X : Y
	type FromEntries<T> = T extends [infer Key, any][]
		? {[K in Cast<Key, string>]: Extract<ArrayElement<T>, [K, any]>[1]}
		: {[key in string]: any}

	type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>
}

interface ObjectConstructor {
	// https://dev.to/svehla/typescript-object-fromentries-389c
	fromEntries<T>(obj: T): Lib.FromEntriesWithReadOnly<T>
	//  https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
	// https://stackoverflow.com/a/60142095/1398479
	keys<T>(x: T): (keyof T)[]
	values<T>(x: T): T[keyof T][]
	entries<T>(x: T): import('type-fest').Entries<T>
}
