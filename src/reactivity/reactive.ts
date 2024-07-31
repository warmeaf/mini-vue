import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers)
}

export const shallowReadonly = (raw: any) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export const isReactive = (value: any) => {
  // 如果是响应式对象会触发 getter，返回 true
  // 如果是非响应式对象，访问不存在的属性，返回 undefined
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value: any) => {
  // 如果是响应式对象会触发 getter，返回 true
  // 如果是非响应式对象，访问不存在的属性，返回 undefined
  return !!value[ReactiveFlags.IS_READONLY]
}

const createActiveObject = (raw: any, baseHandlers: any) => {
  return new Proxy(raw, baseHandlers)
}
