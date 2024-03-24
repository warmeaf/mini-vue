import { describe, expect, it, vi } from 'vitest'
import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
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
