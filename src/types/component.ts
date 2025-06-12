import VNode from "src/core/vdom/vnode"
import { GlobalAPI } from "./global-api"
import { VNodeComponentOptions } from "./vnode"
import Watcher from "src/core/observer/watcher"
import { ComponentOptions } from "./options"

export declare class Component {
    constructor(options?:any)   
    static cid:number
    static options:Record<string,any>
    // static directive:GlobalAPI['directive']
    static component:GlobalAPI['component']
    static filter:GlobalAPI['filter']
    static mixin:GlobalAPI['mixin']
    static use: GlobalAPI['use']

    $el:any
    $data:Record<string,any>
    $props:Record<string,any>
    $options: ComponentOptions
    $root:Component
    $parent:Component | undefined
    $children: Array<Component>
    $slots:{[key:string]:Array<VNode>}
    $refs:{[key:string]:Component | Element | Array<Component | Element> | undefined}

    $watch:(expOrFn:string | (()=>any),cb:Function,options?:Record<string,any>) => Function
    $mount:(el?:Element | string,hydrating?:boolean) => Component & {[key:string]:any}
    $set:<T>(target:Record<string,any>|Array<T>,key:string|number,val:T) => T
    $nextTick:(fn:(...args:any[])=>any) => void|Promise<any>
    $emit:(event:string,...args:Array<any>) => Component

    _uid:number|string
    _name:string
    _self:Component
    _isMounted:boolean

    _init:Function
    _hasHookEvent:boolean;
    _watcher:Watcher
    _watchers:Array<Watcher>;
    _props:Record<string,any>;
    _data:Record<string,any>;// 定义一个灵活对象类型，键是字符串，值是任何类型
    _computedWatchers:{[key:string]: Watcher}
} 