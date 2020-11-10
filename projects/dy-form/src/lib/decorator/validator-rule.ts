import {VALIDATOR_RULE} from './form-metadata';
import {RuleType} from '@supine/validator';

export function ValidatorRule<T = any>(rule: RuleType, msg?: { [key: string]: any } | string): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(VALIDATOR_RULE, { rule, msg }, target, propertyKey);
  };
}
