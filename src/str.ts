// export const floatToStr = (f: number, ndigit = 2) => String(Math.round(f * (10 ** ndigit)) / (10 ** ndigit))
import {isBrowser} from './dom.js'

export function capitalize(str: string) {
	return str && str[0]!.toUpperCase() + str.slice(1)
}

export function uncapitalize(str: string) {
	return str && str[0]!.toLowerCase() + str.slice(1)
}

// https://github.com/brianloveswords/base64url/blob/fce104a75ebade9bbeb761d74153b46938c2fef4/src/base64url.ts
function padString(input: string): string {
	const segmentLength = 4
	const stringLength = input.length
	const diff = stringLength % segmentLength

	if (!diff) {
		return input
	}

	let position = stringLength
	let padLength = segmentLength - diff
	const paddedStringLength = stringLength + padLength
	const buffer = Buffer.alloc(paddedStringLength)

	buffer.write(input)

	while (padLength--) {
		buffer.write('=', position++)
	}

	return buffer.toString()
}

// base64: A-Z (0-25), a-z(26-51), 0-9(52-61), +(62), /(63), =(64)
// for file name, / => -

// for uri, + => -, / => _, = => ''
export function base64ToURI(str: string) {
	return str
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
} // or ~
export function uriToBase64(str: string) {
	return padString(str)
		.replace(/~/g, '=')
		.replace(/_/g, '/')
		.replace(/-/g, '+')
}

export const isoBtoa = isBrowser
	? btoa
	: (binary: string) => Buffer.from(binary)
		.toString('base64')
export const isoAtob = isBrowser
	? atob
	: (binary: string) => Buffer.from(binary, 'base64')
		.toString()

// for vietnamese
export function normalizeVietnamese(str: string) {
	return str
		// lowercase
		.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
		.replace(/[èéẹẻẽêềếệểễ]/g, 'e')
		.replace(/[ìíịỉĩ]/g, 'i')
		.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
		.replace(/[ùúụủũưừứựửữ]/g, 'u')
		.replace(/[ỳýỵỷỹ]/g, 'y')
		.replace(/đ/g, 'd')
		// uppercase
		.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
		.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
		.replace(/[ÌÍỊỈĨ]/g, 'I')
		.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
		.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
		.replace(/[ỲÝỴỶỸ]/g, 'Y')
		.replace(/Đ/g, 'D')
		// Some system encode vietnamese combining accent as individual utf-8 characters
		.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, '') // Huyền sắc hỏi ngã nặng
		// eslint-disable-next-line no-misleading-character-class
		.replace(/[\u02C6\u0306\u031B]/g, '')
} // Â, Ê, Ă, Ơ, Ư
