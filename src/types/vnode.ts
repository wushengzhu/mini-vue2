import VNode from "src/core/vdom/vnode"
import { PropOptions } from "./options"


export interface VNodeData{

}

export type VNodeComponentOptions = {
  [key:string]:any
  componentId?:string
  data: object | Function | void
  props?: string[] | Record<string,Function | Array<Function> | null | PropOptions>
}


export type VNodeChildren = | Array<null | VNode | string | number | VNodeChildren> | string

