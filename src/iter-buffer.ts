export async function asyncIteratorToArray<T>(it: AsyncIterable<T>) {
	const arr: T[] = []
	for await (const v of it) arr.push(v)
	return arr
}

export async function* readableStreamToAsyncIterator(stream: ReadableStream<Uint8Array>) {
	// node >= 18.0.0 supports web stream API
	const reader = stream.getReader()

	try {
		while (true) {
			const {
				done,
				value
			} = await reader.read()
			if (done) return
			yield value
		}
	} finally {
		// safari (iOS and macOS) doesn't support .releaseReader()
		// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/releaseLock#browser_compatibility
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		reader?.releaseLock()
	}
	// const stream = genericStream as Readable
	// const buffers: Buffer[] = []
	// let defer = makeDefer<void>()
	//
	// const onData = (data: Buffer) => {
	// 	buffers.push(data)
	// 	defer.resolve()
	// 	defer = makeDefer<void>()
	// }
	// stream.on('data', onData)
	//
	// const onError = (e: Error) => defer.reject(e) // defer changes, so we need to wrap it first
	// stream.on('error', onError)
	//
	// let done = false
	// const onEnd = () => {
	// 	defer.resolve()
	// 	done = true
	// }
	// stream.on('end', onEnd)
	//
	// try {
	// 	// eslint-disable-next-line no-unmodified-loop-condition
	// 	while (!done) {
	// 		await defer.promise
	// 		yield* buffers
	// 		if (done) break
	// 		buffers.length = 0
	// 	}
	// } finally {
	// 	stream.off('data', onData)
	// 	stream.off('error', onError)
	// 	stream.off('end', onEnd)
	// }
}

// Buffer is a subclass of Uint8Array, so it can be used as a ReadableStream's source
// https://nodejs.org/api/buffer.html
export function concatBuffers(buffers: Uint8Array[]) {
	const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0)
	const result = new Uint8Array(totalLength)
	let offset = 0
	for (const buffer of buffers) {
		result.set(new Uint8Array(buffer), offset)
		offset += buffer.byteLength
	}
	return result
}
