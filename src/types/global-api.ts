import { Component } from "./component"


export interface GlobalAPI {
  (options?:any):void
  options:Record<string,any>

  extend:(options:typeof Component | object) => typeof Component
  mixin:(mixin:Object) => GlobalAPI
  set:<T>(target:Object|Array<T>,key:string|number) => void
  delete:<T>(target:Object | Array<T>,key:string | number) => void
  nextTick:(fn:Function,context?:Object) => void | Promise<any>
  use:(plugin:Function | Object) => GlobalAPI
  observable:<T>(value:T) => T
  filter:(id:string,def?:Function) => Function | void
  component:(id:string,def?:Function) => Function | void
  [key:string]:any
}