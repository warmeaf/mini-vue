// import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any
  private _dirty: Boolean = true
  private _value: any
  // private _effect: ReactiveEffect

  constructor(getter: Function) {
    this._getter = getter
    // this._effect = new ReactiveEffect(getter, () => {
    //   this._dirty = true
    // })
  }

  get value() {
    // 第一次访问调用 getter
    // 后续访问直接返回 value
    if (this._dirty) {
      this._dirty = false
      // this._value = this._effect.run()
      this._value = this._getter()
    }

    return this._value
  }
}

export const computed = (getter: Function) => {
  return new ComputedRefImpl(getter)
}
