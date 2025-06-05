import { def } from "../util/lang"



const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

// 劫持数组，检测数组的变化通知Vue的响应式系统
methodsToPatch.forEach(function(method){
  const original = arrayProto[method] // 缓存原生方法

  def(arrayMethods,method,function mutator(...args){
    const result = original.apply(this,args)
    const ob = this.__ob__
    let inserted
    switch(method){
        case 'push':
        case 'unshift':
            inserted = args // 插入元素
            break
        case 'splice':
            inserted = args.slice(2)  // 拿第三个元素（含第三）开始的所有元素，排除前两个默认参数（this,事件对象）
            break
    }
    if(inserted) ob.observeArray(inserted)
    ob.dep.notify() // 通知所有依赖该数组的观察者，触发视图更新
    return result
  })
})