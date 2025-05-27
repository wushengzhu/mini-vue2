import { Component } from "src/types/component"
import { VNodeComponentOptions, VNodeData } from "src/types/vnode"


export default class VNode{
    tag?: string // 节点标签类型
    data: VNodeData | undefined // 包含节点的其他属性
    children?:Array<VNode> | null // 当前节点的子节点数组
    text?:string // 当前节点的文本内容
    elm:Node | undefined // 当前虚拟节点对应的DOM元素
    key:string | number | undefined // 当前节点的唯一标识
    context?: Component // 传递上下文
    componentOptions?:VNodeComponentOptions
    componentInstance?: Component // 组件实例
    parent: VNode | undefined | null // 当前节点的父节点
    asyncFactory?:Function // 异步组件加载
    
    isOnce:boolean // 当前节点是否是“一次性”节点
    isStatic: boolean // 当前节点及其子节点是否是静态（不会变化
    isComment: boolean // 当前节点是否是一个注释节点

    constructor(tag?:string,data?:VNodeData,children?:Array<VNode>|null,text?:string,elm?:Node,context?:Component,componentOptions?:VNodeComponentOptions,asyncFactory?:Function){
     this.tag = tag;
     this.data = data;
     this.children = children
     this.text = text;
     this.elm = elm
     this.context = context
     this.componentOptions = componentOptions
     this.asyncFactory = asyncFactory
     this.isComment = false;
     this.isStatic = false;
     this.isOnce = false;
    }

    get child():Component | void {
        return this.componentInstance
    }
}