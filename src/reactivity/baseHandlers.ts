import { isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

// createGetter 内部返回值是一个函数
// 我以为会在 getter 函数中新增一个 isReadonly 参数
// 但是这里实现的优雅一些，用到了高阶函数
const createGetter = (isReadonly = false, shallow = false) => {
  return (target: any, key: any) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    // Proxy 只能代理浅层对象，如果想要代理深层对象，需要判断
    // 如果 res 是一个对象，则返回 reactive/readonly 生成的代理对象
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, key)
    }

    return res
  }
}

// createSetter 内部返回值是一个函数
const createSetter = () => {
  return (target: any, key: any, value: any) => {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

// 初始化的时候就创建，而不是每次访问的时候才创建
const get = createGetter()
const set = createSetter()
const readdonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readdonlyGet,
  set(target: any, key: any) {
    console.warn(`key: ${key} set 失败，因为 target 是 readonly 的`, target)
    return true
  },
}

export const shallowReadonlyHandlers = Object.assign({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
