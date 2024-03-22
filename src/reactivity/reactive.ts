import { track, trigger } from './effect'

// createGetter 内部返回值是一个函数
// 我以为会在 getter 函数中新增一个 isReadonly 参数
// 但是这里实现的优雅一些，用到了高阶函数
const createGetter = (isReadonly = false) => {
  return (target: any, key: any) => {
    const res = Reflect.get(target, key)

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

export const reactive = (raw: any) => {
  return new Proxy(raw, {
    get: createGetter(),

    set: createSetter(),
  })
}

export const readonly = (raw: any) => {
  return new Proxy(raw, {
    get: createGetter(true),

    set() {
      return true
    },
  })
}
