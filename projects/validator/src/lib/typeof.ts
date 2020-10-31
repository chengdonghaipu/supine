export function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

// 是否是数字
export function isNumber(value) {
  return Object.prototype.toString.call(value) === '[object Number]';
}

// 是否是布尔值
export function isBoolean(value) {
  return Object.prototype.toString.call(value) === '[object Boolean]';
}

// 是否undefined
export function isUndefined(value) {
  return Object.prototype.toString.call(value) === '[object Undefined]';
}

// 是否是null
export function isNull(value) {
  return Object.prototype.toString.call(value) === '[object Null]';
}

// 是否数组
export function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

// 是否是函数
export function isFunction(value) {
  return Object.prototype.toString.call(value) === '[object function]';
}

// 是否是对象
export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

// 是否是正则表达式
export function isRegExp(value) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

// 是否是日期对象
export function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isFloat(value) {
  return isNumber(value) && value + '.0' !== value;
}
