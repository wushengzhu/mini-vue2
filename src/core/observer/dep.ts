
export interface DepTarget{
  id:number
  addDep(dep:Dep):void
  update():void
}


let uid = 0;
const pendingCleanupDeps: Dep[] = []
/**
 * 依赖收集器 管理Watcher实例
 * 用于实现响应式数据绑定和视图更新机制
 * 依赖收集、通知订阅者、实现响应机制
 */
export default class Dep {
    static target?:DepTarget|null
    id:number
    subs:Array<DepTarget|null>
    _pending = false

    constructor(){
        this.id = uid++
        this.subs = []
    }

    addSub(sub:DepTarget){
        this.subs.push(sub)
    }

    removeSub(sub:DepTarget){
        this.subs[this.subs.indexOf(sub)] = null
        if(!this._pending){
            this._pending = true;
            pendingCleanupDeps.push(this)
        }
    }

    depend(){
        if(Dep.target){
            Dep.target.addDep(this)
        }
    }

    notify(){
      const subs = this.subs.filter(s => s) as DepTarget[] // 在处理订阅者列表之前，先创建一个稳定的快照，避免遍历过程中出现变化导致问题
      for(let i =0,l = subs.length; i<l;i++){
        const sub = subs[i]
        sub.update()
      }
    }
}


Dep.target = null
const targetStack: Array<DepTarget | null | undefined> = []

export function pushTarget(target?: DepTarget | null){
    targetStack.push(target)
    Dep.target = target
}

export function popTarget(){
    targetStack.pop()
    Dep.target = targetStack[targetStack.length-1]
}