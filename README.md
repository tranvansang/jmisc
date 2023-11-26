# jmisc - Javascript utilities tool

# Exported APIs

```typescript
export {isBrowser, ensureBrowser} from './dom'
export {negate, identity, noop, not} from './func'
export {asyncIteratorToArray, readableStreamToAsyncIterator, concatBuffers} from './iter-buffer'
export {makeLazy, makeMemoize, makeLazySync} from './lazy'
export {isValidNumber, isInteger, floatToStr} from './num'
export {recursiveSet, deepHas, get, set, deepPick, pick, omit, pluck, objectMap, emptyObject, emptyArray, isObject, zip} from './obj'
export {capitalize, uncapitalize, base64ToURI, uriToBase64, isoBtoa, isoAtob, normalizeVietnamese} from './str'
export {sleep, setTimeoutUntil} from './time'
export {as} from './type'
export type {IgnoreLastIfVoid, UndefinedToNull, Nullable, UnionToIntersection, AllOrNone, Promisable} from './type'
```
