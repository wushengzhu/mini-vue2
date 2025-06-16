import { Component } from "src/types/component";
import { ComponentOptions } from "src/types/options";
import config from "../config";
import { camelize, hasOwn, isPlainObject } from "src/shared/util";


const defaultStart = function (parentVal:any,childVal:any):any{
    return childVal === undefined ? parentVal : childVal
}

const starts = config.optionsMergeStrategies


function normalizeProps(options:Record<string,any>,vm?:Component|null){
    const props = options.props
    if(!props) return
    const res:Record<string,any> = {}
    let i,val,name
    if(Array.isArray(props)){

    }else if(isPlainObject(props)){
        for(const key in props){
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val)?val:{type:val}
        }
    }
    options.props = res
}

export function mergeOptions (parent:Record<string,any>,child:Record<string,any>,vm?:Component):ComponentOptions{
    
    if(typeof child === 'function'){
        child = child.options
    }

    normalizeProps(child,vm);
    // normalizeProps(child,vm);
    // normalizeProps(child,vm);

    if(!child._base){
    // _base存在时，表示子组件已经处理过基类的合并，不需要再进行操作了
      if(child.extends){
        parent = mergeOptions(parent,child.extends,vm)
      }
      if(child.mixins){
        for(let i=0,l=child.mixins.length;i<l;i++){
            parent = mergeOptions(parent,child.mixins[i],vm)
        }
      }
    }

    const options:ComponentOptions = {} as any
    let key
    for(key in child){
        mergeField(key)
    }
    for(key in child){
        if(!hasOwn(parent,key)){
            mergeField(key)
        }
    }
    function mergeField(key:any){
        const start = starts[key] || defaultStart
        options[key] = start(parent[key],child[key],vm,key)
    }
    return options
}