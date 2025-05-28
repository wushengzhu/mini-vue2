


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