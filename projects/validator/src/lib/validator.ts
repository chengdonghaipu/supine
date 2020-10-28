import {validatorRuleConstructor} from './type';
import 'reflect-metadata';
import {VALIDATOR_RULE} from './token';

export function Validator(metaData: {rules: validatorRuleConstructor<any>[]}): ClassDecorator {
  return target => {
    Reflect.defineMetadata(VALIDATOR_RULE, metaData, target);
  };
}

export class ZlValidator {
  protected dataMap: Map<string, any> = new Map<string, any>();

  private parseData(data, parent?: string) {

  }
}
