import { isDef, isPrimitive } from "src/shared/util"
import { Component } from "src/types/component"
import VNode, { createEmptyVNode } from "./vnode"


const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

/**
 * 将模板编译后的AST转换为虚拟节点树
 * @param context 
 * @param tag 
 * @param data 
 * @param children 
 * @param normalizationType  // 控制子节点的规范化方式
 * @param alwaysNormalize  // 是否进行归一化处理
 */
export function createElement(context:Component,tag:any,data:any,children:any,normalizationType:any,alwaysNormalize: boolean): VNode | Array<VNode>{
   if(Array.isArray(data) || isPrimitive(data)){
    // 是否是数组或原生数组
     normalizationType = children
     children = data
     data = undefined
   }
   return _createElement(context,tag,data,children,normalizationType)
}

export function _createElement(context:Component,tag:any,data:any,children:any,normalizationType:any){

    let vnode,ns 
    if(typeof tag === 'string'){
        let Ctor
    }

    if(Array.isArray(vnode)){
        return vnode
    }else if(isDef(vnode)){
        return vnode
    }else {
        return createEmptyVNode()
    }
}

