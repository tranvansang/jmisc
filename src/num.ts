export function isValidNumber (x: any): x is number {
	return typeof x === 'number' && !isNaN(x) && isFinite(x)
}
export function isInteger(x: number) {
	return x === Math.round(x)
}

export function floatToStr(f: number, ndigit = 2) {
	const str = f.toFixed(ndigit)
	return ndigit
		? str
			.replace(/0*$/g, '')
			.replace(/\.$/, '')
		: str
}

