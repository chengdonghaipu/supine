import 'reflect-metadata';
import {TYPE_MESSAGE} from './token';

export function TypeMessage(): PropertyDecorator {
  return (target, propertyKey) => {
    const constructor = typeof target === 'function' ? target : target.constructor;

    const message = Reflect.getMetadata(TYPE_MESSAGE, constructor) || [];

    message.push(propertyKey);

    Reflect.defineMetadata(TYPE_MESSAGE, message, constructor);
  };
}
