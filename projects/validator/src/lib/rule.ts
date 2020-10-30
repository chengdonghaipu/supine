import 'reflect-metadata';
import {RULE_MAP} from './token';

export function Rule(): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const constructor = typeof target === 'function' ? target : target.constructor;

    const ruleMap = Reflect.getMetadata(RULE_MAP, constructor) || {};

    if (ruleMap[propertyKey]) {
      throw Error(`规则: [${propertyKey}] 已经存在`);
    } else {
      ruleMap[propertyKey] = descriptor.value;
    }

    Reflect.defineMetadata(RULE_MAP, ruleMap, constructor);
  };
}
