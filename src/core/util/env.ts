

export interface SimpleSet {
    has(key:string | number):boolean
    add(key:string | number): any
    clear():void
}

export const hasProto = '__proto__' in {} // __proto__ 对象是否存在


let _isServer

export const isServerRendering = ()=>{
    if(_isServer === undefined){

    }
    return _isServer
}