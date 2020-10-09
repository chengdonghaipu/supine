import {VALIDATOR_RULE} from './form-metadata';

export function ValidatorRule<T = any>(rule: string | string[], msg?: { [key: string]: any } | string): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(VALIDATOR_RULE, { rule, msg }, target, propertyKey);
  };
}
