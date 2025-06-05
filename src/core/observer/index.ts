import { hasProto } from "../util/env";
import { def } from "../util/lang";
import { arrayMethods } from "./array";
import Dep from "./dep";


const arrayKeys = Object.getOwnPropertyNames(arrayMethods) // 获取数组所有属性

export class Observer{
    value:any;
    dep:Dep;
    vmCount:number;

    constructor(value:any){
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0

        def(value,'__ob__',this)
        if(Array.isArray(value)){
            if(hasProto){ // 是否有__proto__
                // protoAugment(value,arrayMethods)
                ;(value as any).__proto__ = arrayMethods // 数组原型指向arrayMethods，数组实例会继承这些方法
            }else{
                // copyAugment(value,arrayMethods,arrayKeys)
                for(let i=0,l=arrayKeys.length;i<l;i++){
                    // 如果环境不支持__proto__，逐个为数组对象定义arrayMethods中的方法
                    const key = arrayKeys[i]
                    def(value,key,arrayMethods[key])
                }
            }
        }else{
            this.walk(value)
        }
    }

    walk(obj:Object){
        const keys = Object.keys(obj)
        // 将普通的数据对象转换为响应式对象
        for(let i = 0;i<keys.length;i++){
            defineReactive(obj,keys[i])
        }
    }

    observerArray(items:Array<any>){
        for(let i=0,l=items.length;i<l;i++){
            observe(items[i])
        }
    }
}

export function observe(value:any,asRootData?:boolean):Observer | void{
  
}

export function defineReactive(obj:Object,key:string,val?:any,customSetter?:Function,shallow?:boolean){
    const dep = new Dep();
    
    const property = Object.getOwnPropertyDescriptor(obj,key) // 获取对象某个属性的描述符
    if(property && property.configurable === false){
        return
    }

    const getter = property && property.get
    const setter = property && property.set
    if((!getter || setter) && arguments.length === 2){
        val = obj[key] // 获取当前属性的值，可能是依赖收集或者更新的时候
    }
    let childOb = !shallow && observe(val) // 不是浅层观察，则对值进行观察，确保嵌套对象的响应式
    
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function reactiveGetter(){
            const value = getter ? getter.call(obj) : val;
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend()
                    if(Array.isArray(value)){
                        dependArray(value)
                    }
                }
            }
        },
        set:function reactiveSetter(newVal){
            const value = getter ? getter.call(obj) : val
            if(newVal === value || (newVal !== newVal && value !== value)){
                return
            }
            if(getter && !setter) return
            if(setter){
                setter.call(obj,newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}

function dependArray(value:Array<any>){
    for(let e,i=0,l=value.length;i<l;i++){
      e=value[i]
      e&&e.__ob__ && e.__ob__.dep.depend()
      if(Array.isArray(e)){
        dependArray(e)
      }
    }
}