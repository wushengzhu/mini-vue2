import { Component } from "src/types/component";
import { validateProp } from "../util/props";

export function initState(vm:Component){
  vm._watchers = []
  const opts = vm.$options
  if(opts.props) initProps(vm,opts.props)
}


function initProps(vm:Component,propsOptions:Object){
  const propsData = vm.$options.propsData || {} // propsData是原始的，未经处理的prop数据。props是经过处理的数据
  const props = vm._props = {}
  const keys:string[] = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  if(!isRoot){

  }
  for(const key in propsOptions){
    keys.push(key)
    const value = validateProp(key,propsOptions,propsData,vm)
    defineReactive(props,key,value)

    // if(!(key in vm)){
    //   proxy(vm,'_props',key)
    // }
  } 
}