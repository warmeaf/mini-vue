let activeEffect: null | ReactiveEffect = null
// 初始状态不允许收集依赖
let shouldTrack = false

class ReactiveEffect {
  private _fn: any
  private _active = true

  // 为什么 deps 是一个数组呢？考虑如下情况：
  // 参考图解：https://www.yuque.com/nextc/xmq8ew/hztf3epl6kkav39y#nteU8
  // let dummy
  // const obj = reactive({ prop: 1 })
  // const obj02 = reactive({ prop: 2 })
  // const runner = effect(() => {
  //   dummy = obj.prop + obj02.prop
  // })
  deps: any = []
  onStop?: () => void

  constructor(fn: any, public scheduler?: any) {
    this._fn = fn
  }

  run() {
    if (!this._active) {
      return this._fn()
    }

    // 执行_fn之前，打开依赖收集的开关
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    // 重置依赖收集的开关
    // 当 stop 后，_active 一直是 false
    // 所以收集依赖的开关会一直处于关闭状态
    shouldTrack = false
    return result
  }

  stop() {
    if (this._active) {
      this.onStop?.()
      cleanupEffect(this)
      // 标记为已清空
      this._active = false
    }
  }
}

const cleanupEffect = (effect: ReactiveEffect) => {
  // 找到所有依赖这个 effect 的响应式对象
  // 从这些响应式对象里面把 effect 给删除掉
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new WeakMap()
export const track = (target: Object, key: string | symbol) => {
  if (!isTracking()) return

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

  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  // 每个 ReactiveEffect 实例的 deps 收集 dep
  activeEffect && activeEffect.deps.push(dep)
}

const isTracking = () => {
  return shouldTrack && activeEffect !== null
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

export const effect = (fn: Function, options: any = {}) => {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.onStop = options.onStop

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
