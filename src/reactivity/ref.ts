import { trackEffects, triggerEffects, isTracking } from './effect'
import { reactive } from './reactive'
import { isObject, hasChanged } from '../shared'

class RefImpl {
  private _value: any
  public dep: any
  private _rawValue: any
  // 设置一个只读的标识符
  public readonly __v_isRef = true

  constructor(value: any) {
    this._rawValue = value
    this._value = isObject(value) ? reactive(value) : value
    this.dep = new Set()
  }

  get value() {
    this.trackRefValue()
    return this._value
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = isObject(newValue) ? reactive(newValue) : newValue
      // 派发更新，把集合里的函数都再执行一次
      triggerEffects(this.dep)
    }
  }

  trackRefValue() {
    if (isTracking() && !isObject(this._rawValue)) {
      // 收集依赖，把副作用函数放到集合里
      trackEffects(this.dep)
    }
  }
}

// const trackRefValue = (ref: RefImpl) => {
//   if (isTracking() && !isObject(ref.value)) {
//     // 收集依赖，把副作用函数放到集合里
//     trackEffects(ref.dep)
//   }
// }

export const ref = (value: any) => {
  return new RefImpl(value)
}

export const isRef = (ref: any) => {
  return !!ref.__v_isRef
}

export const unRef = (ref: any) => {
  return isRef(ref) ? ref.value : ref
}
