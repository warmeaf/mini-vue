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
})
