import { describe, expect, it } from 'vitest'
import { readonly } from '../reactive'

describe('reactivity/readonly', () => {
  it('Object', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  })
})
