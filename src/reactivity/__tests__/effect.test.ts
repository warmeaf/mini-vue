import { describe, expect, it } from 'vitest'
import { reactive } from '../reactive'
import { effect } from '../effect'

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
})
