export const isObject = (raw: any) => {
  return typeof raw === 'object' && raw !== null
}

export const hasChanged = (val: any, newVal: any) => {
  return !Object.is(val, newVal)
}
