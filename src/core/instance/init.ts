import { Component } from "src/types/component";
import { callHook, initLifecycle } from "./lifecycle";
import { initState } from "./state";
import { initRender } from "./render";


let uid = 0

export function initMixin(Vue:typeof Component){
    Vue.prototype._init = function (options?:Record<string,any>){
        const vm: Component = this
        vm._uid = uid++

        // let startTag,endTag

        vm._self = vm
        initLifecycle(vm) // 初始化生命周期
        // initEvents(vm)
        initRender(vm)
        callHook(vm,'beforeCreate') // 确保钩子函数在正确的时机执行
        initState(vm) // 初始化Vue实例核心状态，包括数据、计算属性等
        callHook(vm,'created')

        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
}