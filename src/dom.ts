export const isBrowser = typeof window === 'object'
export function ensureBrowser() {
	if (!isBrowser) throw new Error('must be in browser')
}
