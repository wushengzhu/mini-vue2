import { Component } from "src/types/component";
import { validateProp } from "../util/props";
import { defineReactive } from "../observer";
import { bind, noop } from "src/shared/util";

export function initState(vm:Component){
  vm._watchers = []
  const opts = vm.$options
  if(opts.props) initProps(vm,opts.props)
  if(opts.methods) initMethods(vm,opts.methods)
}

// 在某些情况下，我们可能需要在组件的更新计算过程中禁用观察机制（用来追踪数据变化并触发视图更新的核心功能）
export let shouldObserve:boolean = true

export function toggleObserving(value:boolean){
  shouldObserve = value
}

// 将组件props转换为响应式数据
function initProps(vm:Component,propsOptions:Object){
  const propsData = vm.$options.propsData || {} // propsData是原始的，未经处理的prop数据。props是经过处理的数据
  const props = vm._props = {}
  const keys:string[] = vm.$options._propKeys = []
  const isRoot = !vm.$parent // 当前组件是否是根实例（没有父组件）
  if(!isRoot){
    // 非根实例关闭响应式观察，避免父组件的props被多次劫持，防止不必要的更新触发
    toggleObserving(false)
  }
  for(const key in propsOptions){
    keys.push(key)
    const value = validateProp(key,propsOptions,propsData,vm)
    defineReactive(props,key,value)

    if(!(key in vm)){
      // prop不存在该属性时，也就是动态传递的props需要通过proxy进行代理
      proxy(vm,'_props',key)
    }
  } 
  toggleObserving(true)
}

function initMethods(vm: Component,methods: Object){
  const props = vm.$options.props
  for(const key in methods){
    // vm上下文
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key],vm) 
  }
}

const sharedPropertyDefinitin = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
export function proxy(target:Object,sourceKey:string,key:string){
  sharedPropertyDefinitin.get = function proxyGetter(){
    return this[sourceKey][key]
  }
  sharedPropertyDefinitin.set = function proxySetter(val){
    this[sourceKey][key] = val
  }
  Object.defineProperty(target,key,sharedPropertyDefinitin)
}