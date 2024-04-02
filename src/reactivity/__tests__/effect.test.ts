import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    // effect 中传入的函数应该被执行
    expect(nextAge).toBe(11)

    // update
    user.age = user.age + 1
    expect(nextAge).toBe(12)
  })

  // 为什么要返回 runner？
  // 我的理解：为后续 scheduler 提供便利
  it('调用 effect 返回 runner', () => {
    // effect() -> fn(runner) -> call -> return
    // 调用 effect 返回一个 runner
    // runner 是一个函数，调用时会执行 effect 传入的函数，并将传入的函数的返回值返回
    let foo = 10

    const runner = effect(() => {
      foo = foo + 1
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  // 为什么要有 scheduler？
  // 我的理解：有了这个调度器（scheduler），我可以手动控制副作用函数 fn的执行
  it('scheduler', () => {
    // 1、通过 effect 的第二个参数给定的一个 scheduler 的 fn
    // 2、effect第一次执行的时候还会执行 fn
    // 3、当响应式对象 set update 不会执行 fn 而是执行 scheduler
    // 4. 如果说当执行 runner 的时候，会再次的执行 fn
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // 当第一次触发依赖时 scheduler 应该被调用
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // 当响应式对象 set 也就是触发更新，不会执行 fn
    expect(dummy).toBe(1)
    // 手动执行 runner
    run()
    // fn 应该被调用
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)

    obj.prop++
    expect(dummy).toBe(3)

    // 停止 runner，派发更新时不会执行 fn
    stop(runner)
    // obj.prop = 3
    // 由 obj.prop = 3 改成 obj.prop++
    // 触发 setter，重新收集了依赖
    obj.prop++
    expect(dummy).toBe(3)

    // 手动调用，依然会执行 fn
    runner()
    expect(dummy).toBe(4)
  })

  // 允许在停止的时候做一些事情，也就是调用 onStop
  it('onStop', () => {
    const onStop = vi.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
})
