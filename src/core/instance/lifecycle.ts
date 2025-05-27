import { Component } from "src/types/component";

// 生命周期初始化
export function initLifecycle(vm:Component){
    const options = vm.$options

    let parent = options.parent
    if(parent && !options.abstract){
        while(parent.$options.abstract && parent.$parent){
            parent = parent.$parent
        }
        parent.$children.push(vm)
    }
    
    vm.$parent = parent
    vm.$root = parent?parent.$root:vm

    vm.$children = []
    vm.$refs = {}
}


export function callHook(vm:Component,hook:string,args?:any[],setContext=true){
    
}