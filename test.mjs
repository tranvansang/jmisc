import {describe, test} from 'node:test'
import assert from 'node:assert'
import {set, get} from './esm/index.js'

describe('obj.mjs', () => {
	test('root value', () => {
		const a = {}
		assert.strictEqual(a, set(undefined, undefined, a))
		assert.strictEqual(a, set(1, undefined, a))
		assert.strictEqual(a, get(a, undefined))
	})
	test('set deep', () => {
		assert.deepStrictEqual({a: 'b'}, set(undefined, 'a', 'b'))
		assert.deepStrictEqual({a: 'b', aa: 'bb'}, set({aa: 'bb'}, 'a', 'b'))
		assert.deepStrictEqual({a: {b: 'b'}, aa: 'bb'}, set({aa: 'bb'}, 'a.b', 'b'))
		assert.deepStrictEqual({a: {b: 'b'}}, set(1, 'a.b', 'b'))
		assert.deepStrictEqual({a: [1, 2, 3]}, set({a: [1, 3, 3]}, 'a.1', 2))
	})
})
