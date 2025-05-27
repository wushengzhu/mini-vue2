import { PropOptions } from "./options"


export interface VNodeData{

}

export type VNodeComponentOptions = {
  [key:string]:any
  componentId?:string
  data: object | Function | void
  props?: string[] | Record<string,Function | Array<Function> | null | PropOptions>
}