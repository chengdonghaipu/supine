import 'reflect-metadata';
import {TYPE_MESSAGE} from './token';

export function DefaultMessage(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const constructor = typeof target === 'function' ? target : target.constructor;

    const message = Reflect.getMetadata(TYPE_MESSAGE, constructor);

    if (message) {
      throw Error(`每个规则类 只允许存在一个生成默认信息提示的方法`);
    }

    Reflect.defineMetadata(TYPE_MESSAGE, descriptor.value, constructor);
  };
}
