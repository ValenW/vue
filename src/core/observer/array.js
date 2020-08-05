/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 使用数组原型创建新对象
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 会修改数组的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // 调用Object.defineProperty重新定义方法
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    // 获取数组对象的ob
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 将新插入数据转换为响应式数据
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 发送数组修改通知
    ob.dep.notify()
    return result
  })
})
