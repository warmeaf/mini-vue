import { describe, expect, it, vi } from 'vitest'
import { isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  it('happy path', () => {
    console.warn = vi.fn()

    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = shallowReadonly(original)

    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.bar)).toBe(false)

    wrapped.foo = 2
    expect(console.warn).toBeCalledWith(
      'key: foo set 失败，因为 target 是 readonly 的',
      wrapped
    )
    wrapped.bar.baz = 3
    expect(wrapped.bar.baz).toBe(3)
  })
})
