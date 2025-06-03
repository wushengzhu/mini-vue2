import Dep from "./dep";




export function defineReactive(obj:Object,key:string,val:any,customSetter?:Function,shallow?:boolean){
    const dep = new Dep();
    
    const property = Object.getOwnPropertyDescriptor(obj,key) // 获取对象某个属性的描述符
    if(property && property.configurable === false){
        return
    }
}