import { describe, expect, it } from 'vitest'
import { reactive, isReactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(observed.foo).toBe(1)
    expect(original).not.toBe(observed)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)

    // obj只是普通对象，但是 isReactive(obj) 返回 true
    // 这种情况不用考虑吗？（ Vue 源码也没考虑）
    // 属于特殊情况，不用考虑
    // const obj = {
    //   __v_isReactive: true,
    // }
    // expect(isReactive(obj)).toBe(false)
  })

  it('嵌套对象', () => {
    const original = {
      bar: 1,
      foo: { bar: 1 },
      array: [
        {
          bar: 2,
        },
      ],
    }

    const observed = reactive(original)
    expect(isReactive(observed.foo)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
