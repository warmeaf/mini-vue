import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactive'
import { computed } from '../computed'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(10)
  })

  it('should computed lazily', () => {
    const value = reactive({
      foo: 1,
    })
    const getter = vi.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)
    // lazy，没有通过 cValue.value 调用，getter 不会执行
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // 再次访问，不应该重复执行
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // 应该在修改 value 的时候，重新执行
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // 应该在修改 value 的时候，重新执行
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
