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
    
    // 如果是以下情况，该怎么处理？
    // const obj = {
    //   __v_is_reactive: true,
    // }
    // expect(isReactive(obj)).toBe(false)
  })
})
