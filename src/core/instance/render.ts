import { Component } from "src/types/component";
import { createElement } from "../vdom/create-element";

export function initRender(vm:Component){
    vm._vnode = null

    const options = vm.$options
    const parentVnode = (vm.$vnode = options._parentVnode!)

    vm._c = (a,b,c,d) => createElement(vm,a,b,c,d,false);
}