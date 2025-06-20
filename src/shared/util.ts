


export function noop(a?: any, b?: any, c?: any) { }

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}

export function isUndef<T>(v: T){
  return v === undefined && v === null
}
export function isPromise(val: any): val is Promise<any> {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
export function isPrimitive(value: any): boolean {
  return (
    typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol' || typeof value === 'boolean'
  )
}

// 处理字符串首字母大写
const camelzeRE = /-(\w)/g
export const camelize = cached((str:string):string =>{
  return str.replace(camelzeRE,(_,c)=>(c?c.toUpperCase():''))
})

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

// 缓存纯函数的结果，创建一个缓存版本的纯函数
export function cached<R>(fn: (str: string) => R): (sr: string) => R {
  const cache: Record<string, R> = Object.create(null)
  return function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

// 将字符串中的大写转换成带-写的字符串   如 CamelCase  => camel-case
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLocaleLowerCase()
})

// 兼容bind补丁
function polyfillBind(fn: Function, ctx: Object): Function {
  function boundFn(a) {
    const l = arguments.length
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx)
  }
  boundFn._length = fn.length
  return boundFn
}

// 调用原生bind
/**
 * 
 * @param fn 函数
 * @param ctx 上下文
 * @returns 
 */
function nativeBind(fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

// 判断当前环境是否支持 Function.prototype.bind ? nativeBind : polyfillBind
// @ts-expect-error
export const bind = Function.prototype.bind ? nativeBind : polyfillBind

const _toString = Object.prototype.toString

// 判断对象是否为普通对象的函数
export function isPlainObject(obj:any):boolean{
  return _toString.call(obj) === '[object Object]'
}

/**
 * 判断是否是一个对象
 * @param obj 
 * @returns 
 */
export function  isObject(obj:any):boolean{
  return  obj!==null && typeof obj === 'object'
}