import VNode from "src/core/vdom/vnode"
import { Component } from "./component"

export type PropOptions = {
    type?:Function | Array<Function> | null
    default?:any
    required?:boolean | null
    validator?:Function | null
}

export type ComponentOptions = {
    [key:string]:any
    componentId?:string
    data: object | Function | void
    props?: string[] | Record<string,Function | Array<Function> | null | PropOptions>
    propsData?:object
    computed?:{
        [key:string]:| Function | {get?:Function,set?:Function,cache?:boolean}
    },
    methods?:{[key:string]:Function}
    watch?:{[key:string]:Function|string}
    
    // DOM
    el?:string | Element
    template?:string
    render:(h:()=>VNode) => VNode

    // 生命周期
    beforeCreate?:Function
    created?:Function
    beforeMount?:Function
    mounted?:Function
    beforeUpdate?:Function
    updated?:Function
    activated?:Function
    deactivated?:Function
    beforeDestroy?:Function
    destroyed?:Function

    components?:{[key:string]:Component}
    
    model?:{
      prop?:string
      event?:string
    }

    name?:string
    mixins?:Array<Object>

    abstract:any
  }