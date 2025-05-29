import { hasOwn, hyphenate } from "src/shared/util";
import { Component } from "src/types/component";
import { PropOptions } from "src/types/options";


export function validateProp(key:string,propOptions:Object,propsData:Object,vm?:Component):any{
  const prop = propOptions[key]
  const absent = !hasOwn(propsData,key)
  let value = propsData[key]
  // 判断prop是否是Boolean类型 prop.type可能为数组，多个数组类型
  const booleanIndex = getTypeIndex(Boolean,prop.type)
  if(booleanIndex > -1){
    if(absent && !hasOwn(prop,'default')){
        value = false
    }else if(value===''||value === hyphenate(key)){
      const stringIndex = getTypeIndex(String,prop.type)
      if(stringIndex<0 || booleanIndex<stringIndex){
        value = true
      }
    }
  }

  if(value === undefined){
    value = getPropDefaultValue(vm,prop,key)
  }

  return value
}

function getPropDefaultValue(vm:Component|undefined,prop:PropOptions,key:string){
    if(!hasOwn(prop,'default')){
        return undefined
    }
    const def = prop.default
    if(vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key]!==undefined){
        return vm._props[key]
    }
    return typeof def === 'function' && getType(prop.type) !== 'Function'?def.call(vm):def
}

const functionTypeCheckRE = /^\s*function(\W+)/
function getType(fn){
   const match = fn && fn.toString().match(functionTypeCheckRE)
   return match ? match[1] : ''
}

function isSameType(a,b){
    return getType(a) === getType(b)
}

// 返回prop中数据类型为function、
function getTypeIndex(type,expectedTypes):number{
    if(!Array(expectedTypes)){
        return isSameType(expectedTypes,type)?0:-1
    }
    for(let i=0,len=expectedTypes.length;i<len;i++){
        if(isSameType(expectedTypes[i],type)){
            return i
        }
    }
    return -1
}