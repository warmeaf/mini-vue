class ReactiveEffect {
  private _fn: any

  constructor(fn: any) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new WeakMap()
export const track = (target, key) => {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.forEach((effect) => effect.run())
}

let activeEffect: null | ReactiveEffect = null
export const effect = (fn: Function) => {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}
