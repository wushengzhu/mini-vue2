import { Component } from "src/types/component";
import { validateProp } from "../util/props";
import { defineReactive, observe } from "../observer";
import { bind, hasOwn, isPlainObject, noop } from "src/shared/util";
import Dep, { popTarget, pushTarget } from "../observer/dep";
import { handleError } from "../util/error";
import { warn } from "../util/debug";
import { isReserved } from "../util/lang";
import Watcher from "../observer/watcher";
import { isServerRendering } from "../util/env";

const sharedPropertyDefinitintion = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

// 尝试获取一个原生的watch方法，检测浏览器是否支持原生观察者api
// @ts-expect-error
export const nativeWatch = {}.watch

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
  if(opts.computed) initComputed(vm,opts.computed)
  if(opts.watch && opts.watch !== nativeWatch){
    initWatch(vm,opts.watch)
  }
}

function initWatch(vm:Component,watch:Object){
  for(const key in watch){
    const handler = watch[key]
    if(Array.isArray(handler)){
     
    }else{
      createWatcher(vm,key,handler)
    }
  }
}

function createWatcher(vm:Component,expOrFn:string|(()=>any),handler:any,options?:Object){
   if(isPlainObject(handler)){
    options = handler
    handler = handler.handler
   }
   if(typeof handler === 'string'){
    handler = vm[handler]
   }
   return vm.$watch(expOrFn,handler,options)
}

const computedWatcherOptions = {lazy:true} // 计算属性是懒加载的，只有被访问时才会计算
function initComputed(vm:Component,computed:Object){
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = false;

  for(const key in computed){ // 遍历每个computed
    const userDef = computed[key] // 用户定义的计算属性
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if(getter == null && process.env.NODE_ENV !== 'production'){
      warn(`Getter不存在于当前属性key${key}的计算属性中`,vm)
    }

    if(!isSSR){
      // ssr时计算属性只是getter
      // 非ssr创建Watcher实例，监听getter的变化
      watchers[key] = new Watcher(vm,getter || noop,noop,computedWatcherOptions)
    }

    if(!(key in vm)){
      // vm不存在这个key 调用defineComputed来定义这个计算属性
      defineComputed(vm,key,userDef)
    }
  }
}

export function defineComputed(target:any,key:string,userDef:Object | Function){
   const shouldCache = !isServerRendering()
   if(typeof userDef === 'function'){
      // 
    sharedPropertyDefinitintion.get = shouldCache ?
       createComputedGetter(key) : createGetterInvoker(userDef)
      sharedPropertyDefinitintion.set = noop
   }else{
    // @ts-expect-error
    sharedPropertyDefinitintion.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key):createGetterInvoker(userDef.get):noop
    // @ts-expect-error
    sharedPropertyDefinitintion.set = userDef.set || noop
  }

   Object.defineProperty(target,key,sharedPropertyDefinitintion)
}

function createGetterInvoker(fn){
  return function computedGetter(){
    return fn.call(this,this)
  }
}
function createComputedGetter(key){
  return function computedGetter (){
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if(watcher){
      if(watcher.dirty){
        watcher.evaluate()
      }
      if(Dep.target){
       watcher.depend() 
      }
      return watcher.value
    }
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

export function proxy(target:Object,sourceKey:string,key:string){
  sharedPropertyDefinitintion.get = function proxyGetter(){
    return this[sourceKey][key]
  }
  sharedPropertyDefinitintion.set = function proxySetter(val){
    this[sourceKey][key] = val
  }
  Object.defineProperty(target,key,sharedPropertyDefinitintion)
}