import { Component } from "src/types/component";
import { validateProp } from "../util/props";
import { defineReactive, observe } from "../observer";
import { bind, hasOwn, isPlainObject, noop } from "src/shared/util";
import { popTarget, pushTarget } from "../observer/dep";
import { handleError } from "../util/error";
import { warn } from "../util/debug";
import { isReserved } from "../util/lang";


export function initState(vm:Component){
  vm._watchers = []
  const opts = vm.$options
  if(opts.props) initProps(vm,opts.props)
  if(opts.methods) initMethods(vm,opts.methods)
  if(opts.data){
    initData(vm)
  }else{
    observe(vm._data={},true)
  }
}

// 在某些情况下，我们可能需要在组件的更新计算过程中禁用观察机制（用来追踪数据变化并触发视图更新的核心功能）
export let shouldObserve:boolean = true


export function toggleObserving(value:boolean){
  shouldObserve = value
}

/**
 * 安全调用组件的data函数，获取数据
 * @param data 
 * @param vm 
 * @returns 
 */
export function getData(data:Function,vm:Component):any {
  pushTarget()
  try {
    return data.call(vm,vm)
  }catch(e:any){
    handleError(e,vm,`data()`)
    return {}
  }finally{
    popTarget()
  }
}

function initData(vm: Component){
  let data:any = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data,vm) : data || {}

  if(!isPlainObject(data)){
    data = {}
    process.env.NODE_ENV !== 'production' && warn('data应该返回一个对象',vm)
  }

  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length

  while(i--){
    const key = keys[i]
    if(props && hasOwn(props,key)){
      // 判断属性是否是自定义变量
    }else if(!isReserved(key)){
      proxy(vm,'_data',key)
    }
  }

  observe(data,true)
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