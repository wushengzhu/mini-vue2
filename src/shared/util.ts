


export function noop(a?:any,b?:any,c?:any) {}

export function isDef<T>(v:T):v is NonNullable<T>{
    return v !== undefined && v!==null
}
export function isPromise(val:any):val is Promise<any> {
    return (
        isDef(val) && 
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
    )
}
export function isPrimitive(value:any):boolean{
    return (
        typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol' || typeof value === 'boolean'
    )
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj:Object|Array<any>,key:string):boolean{
    return hasOwnProperty.call(obj,key)
}

// 缓存纯函数的结果，创建一个缓存版本的纯函数
export function cached<R>(fn:(str:string)=>R):(sr:string)=>R{
  const cache:Record<string,R> = Object.create(null)
  return function cachedFn(str:string){
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

// 将字符串中的大写转换成带-写的字符串   如 CamelCase  => camel-case
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str:string):string =>{
  return str.replace(hyphenateRE,'-$1').toLocaleLowerCase()
}) 