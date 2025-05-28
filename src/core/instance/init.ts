import { Component } from "src/types/component";
import { callHook, initLifecycle } from "./lifecycle";


let uid = 0

export function initMixin(Vue:typeof Component){
    Vue.prototype._init = function (options?:Record<string,any>){
        const vm: Component = this
        vm._uid = uid++

        // let startTag,endTag

        vm._self = vm
        initLifecycle(vm)
        // initEvents(vm)
        callHook(vm,'beforeCreate')
        initState(vm)
        callHook(vm,'created')

        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
}