import { Component } from "src/types/component";
import { initLifecycle } from "./lifecycle";


let uid = 0

export function initMixin(Vue:typeof Component){
    Vue.prototype._init = function (options?:Record<string,any>){
        const vm: Component = this
        vm._uid = uid++

        let startTag,endTag

        vm._self = vm
        initLifecycle(vm)
        // initEvents(vm)
      
    }
}