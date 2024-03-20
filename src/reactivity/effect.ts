class ReactiveEffect {
  private _fn: any
  deps = []

  constructor(fn: any, public scheduler?: any) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this)
    })
  }
}

const targetMap = new WeakMap()
export const track = (target: Object, key: string | symbol) => {
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
  // 每个 ReactiveEffect 实例的 deps 收集 dep
  activeEffect && activeEffect.deps.push(dep)
}

export const trigger = (target: Object, key: string | symbol) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.forEach((effect: ReactiveEffect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

let activeEffect: null | ReactiveEffect = null
export const effect = (fn: Function, options: any = {}) => {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)

  _effect.run()

  // 修正 this 指向
  const runner: any = _effect.run.bind(_effect)
  // 方便后续通过 runner 找到 ReactiveEffect 实例
  runner.effect = _effect
  return runner
}

export const stop = (runner: any) => {
  runner.effect.stop()
}
