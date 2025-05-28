import { Component } from "src/types/component";
import Dep from "./dep";
import { noop } from "src/shared/util";
import { parsePath } from "../util/lang";

export interface WatcherOptions {
    deep?:boolean;
    user?:boolean;
    lazy?:boolean;
    sync?:boolean;
    before?:Function;
}

let uid = 0;

export default class Watcher{
  vm:Component;// Vue实例
  expression:string; // 数据属性名
  cb:Function; // 数据变化时执行的回调函数
  id:number; // 唯一标识Watcher实例
  deep:boolean;// 
  user:boolean;
  lazy:boolean;
  sync:boolean; // 是否同步更新
  dirty:boolean;// 是否需要重新计算 
  active:boolean;
  deps:Array<Dep>; // 存储依赖的Dep实例，管理订阅者
  newDeps:Array<Dep>;
  depIds:SimpleSet;
  newDepIds:SimpleSet;
  before?:Function;
  getter:Function;
  value:any;// 存储当前计算的值

  constructor(vm:Component,expOrFn:string | Function,cb:Function,options?:WatcherOptions|null,isRenderWatcher?:boolean){
    this.vm = vm;
    if(isRenderWatcher){
        vm._watcher = this;
    }
    vm._watchers.push(this)

    if(options){
        this.deep = !!options.deep
        this.user = !!options.user
        this.lazy = !!options.lazy
        this.sync = !!options.sync
        this.before = options.before
    }else{
        this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb;
    this.id = ++uid
    this.active = true;
    this.dirty = this.lazy;
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set();
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''

    if(typeof expOrFn === 'function'){
        this.getter = expOrFn
    }else{
        this.getter = parsePath(expOrFn);
        if(!this.getter){
            this.getter = noop;
        }
    }

    this.value = this.lazy ? undefined : this.get()
  }

  get(){
    
  }
}