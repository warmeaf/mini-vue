import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
  IS_READONLY = '__v_is_readonly',
}

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers)
}

export const isReactive = (value: any) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value: any) => {
  return !!value[ReactiveFlags.IS_READONLY]
}

const createActiveObject = (raw: any, baseHandlers: any) => {
  return new Proxy(raw, baseHandlers)
}
