

export function parsePath(path:string): any{
    const segments = path.split('.')
    return function (obj){
        for(let i = 0; i<segments.length; i++){
            if(!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}

// 定义一个属性
export function def(obj:Object,key:string,val:any,enumerable?:boolean){
    Object.defineProperty(obj,key,{
        value:val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}