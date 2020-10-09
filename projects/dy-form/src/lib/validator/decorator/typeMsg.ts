import {isPlainObject} from 'lodash';

export function TypeMsg() {
  return function(target: any, key: string) {
    const _key = '__typeMsg';
    const _getter = function() {
      return target[_key];
    };

    const _setter = function(value) {
      if (!isPlainObject(value)) {
        console.error(`${key} 属性 类型为{ [key: string]: any }
         比如: ${key} = { ruleKey: ':attribute 必须是yes、on或者1或者true' }`);
      }
      target[_key] = isPlainObject(value) ? value : {};
    };

    Object.defineProperty(target, key, {
      get: _getter,
      set: _setter,
      enumerable: true,
      configurable: true
    });
  };
}

