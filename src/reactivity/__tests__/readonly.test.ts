import { describe, expect, it, vi } from 'vitest'
import { readonly, isReadonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.bar)).toBe(true)

    // 如果是以下情况，该怎么处理？
    // const obj = {
    //   __v_isReadonly: true,
    // }
    // expect(isReadonly(obj)).toBe(false)
  })

  it('调用 set 的时候给出警告', () => {
    console.warn = vi.fn()

    const original = { age: 10 }
    const wrapped = readonly(original)
    wrapped.age = 20
    // 这里会给出警告
    expect(console.warn).toBeCalled()
    expect(console.warn).toBeCalledWith(
      'key: age set 失败，因为 target 是 readonly 的',
      original
    )
  })
})
