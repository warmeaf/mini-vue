import { trackEffects, triggerEffects, isTracking } from './effect'
import { hasChanged } from '../shared'

class RefImpl {
  private _value: any
  public dep: any

  constructor(value: any) {
    this._value = value
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(this._value, newValue)) {
      this._value = newValue
      // 派发更新，把集合里的函数都再执行一次
      triggerEffects(this.dep)
    }
  }
}

const trackRefValue = (ref: RefImpl) => {
  if (isTracking()) {
    // 收集依赖，把副作用函数放到集合里
    trackEffects(ref.dep)
  }
}

export const ref = (value: any) => {
  return new RefImpl(value)
}
