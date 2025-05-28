import { Component } from "src/types/component";
import { popTarget, pushTarget } from "../observer/dep";
import { invokeWithErrorHandling } from "../util/error";

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

// 处理钩子函数
export function callHook(vm:Component,hook:string){
    pushTarget() // 在调用生命周期钩子之前，禁用依赖收集，防止在钩子函数中触发响应式更新
    const handlers = vm.$options[hook] // 获取钩子函数
    const info = `${hook} hook`
    if(handlers){
        for(let i = 0,j = handlers.length; i<j; i++){
            // 用于在调用钩子函数时捕获和处理错误
          invokeWithErrorHandling(handlers[i],vm, null, vm,info)
        }
    }
    if(vm._hasHookEvent){
        vm.$emit('hook:'+hook)
    }
    popTarget() // 恢复依赖收集，结束禁用状态
}