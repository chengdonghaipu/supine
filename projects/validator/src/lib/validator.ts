import {CustomMessage, GroupRule, RuleFn, RuleType, ValidatorMetaData, ValidatorRuleConstructor} from './type';
import 'reflect-metadata';
import {RULE_MAP, TYPE_MESSAGE, VALIDATOR_RULE} from './token';
import {RuleParser} from './ruleParser';
import {ValidatorRule} from './validator.rule';

function isPlainObject(target: any) {
  return !Array.isArray(target) && typeof target === 'object';
}

@Validator({
  rules: [ValidatorRule]
})
export class ZlValidator {
  protected dataMap: Map<string, any> = new Map<string, any>();

  private rules: { [key: string]: GroupRule } = {};

  private customMessages: CustomMessage = {};

  private isBatch = false;

  private readonly validatorMetaData: ValidatorMetaData;

  private message: { [key: string]: string[] } = {};

  private parseData(data, parent?: string) {
    if (!isPlainObject(data)) {
      return;
    }

    for (const dataKey in data) {
      if (data.hasOwnProperty(dataKey)) {
        this.dataMap.set(
          parent ? `${parent}.${dataKey}` : dataKey,
          data[dataKey]
        );
        if (isPlainObject(data[dataKey])) {
          this.parseData(
            data[dataKey],
            `${parent ? parent + '.' : ''}${dataKey}`
          );
        }
      }
    }
  }

  constructor() {
    this.validatorMetaData = Reflect.getMetadata(VALIDATOR_RULE, Object.getPrototypeOf(this).constructor);
  }

  setMessage(message: CustomMessage) {
    message && Object.assign(this.customMessages, message);

    return this;
  }

  setTarget(target) {
    target && this.parseData(target);

    return this;
  }

  setRule(rule: { [key: string]: RuleType }) {
    rule && Object.getOwnPropertyNames(rule)
      .forEach(key => this.rules[key] = RuleParser.exportRule(rule[key]));

    return this;
  }

  batch(isBatch = false): this {
    this.isBatch = isBatch;
    return this;
  }

  make(rules?: { [key: string]: RuleType }, data?, message?: CustomMessage) {
    // 解析并设置规则
    this.setRule(rules);
    // 解析数据
    this.setTarget(data);
    // 合并 message
    this.setMessage(message);

    this.passes();

    return this;
  }

  addMessage(filedName: string, msg: string) {
    if (!this.message[filedName]) {
      this.message[filedName] = [];
    }

    this.message[filedName].push(msg);
  }

  clearMessage(filedName?: string) {
    if (!filedName) {
      this.message = {};
    } else {
      this.message[filedName] = [];
    }
  }

  private paddingMessage(filedName: string, ruleName: string, params, value, rule: [RuleFn, ValidatorRuleConstructor<any>]) {
    const customMsg = this.customMessages[`${filedName}.${ruleName}`];

    if (customMsg) {
      return customMsg as string;
    }

    const [] = rule;

    const defaultMessage = this.validatorMetaData.typeMessage.get(rule[1]);

    if (defaultMessage) {
      return defaultMessage(filedName, ruleName, params, value);
    } else {
      throw Error(`规则${ruleName} 未提供默认信息提示`);
    }
  }

  private passes() {
    console.log(this.rules);
    const propertyNames = Object.getOwnPropertyNames(this.rules);

    const {ruleMethod, typeMessage} = this.validatorMetaData;

    propertyNames.forEach(valuePath => {
      const value = this.dataMap.get(valuePath);

      const groupRule = this.rules[valuePath];

      // 自定义校验规则
      if (groupRule.every(rule => typeof rule === 'function')) {

      } else if (groupRule.every(rule => Array.isArray(rule))) {
        const orResult = [];
        for (const orRules of groupRule as Array<Array<[string, any[]] | [string]>>) {
          let andResult = false;

          for (const andRules of orRules) {
            const [ruleName, params] = andRules;

            const [ruleFn] = ruleMethod[ruleName];
            const result = ruleFn(value, params, this.dataMap);

            if (result) {
              andResult = true;
              // 未通过
              this.addMessage(valuePath, typeof result === 'string' ? result :
                this.paddingMessage(valuePath, ruleName, params, value, ruleMethod[ruleName])
              );
            }

            if (!this.isBatch && result) {
              break;
            }
          }

          orResult.push(andResult);

          // 如果有一个结果为false 则整体结果为false 表示通过
          if (orResult.some(result => !result)) {
            break;
          }
        }
      }
    });
    console.log(this.message);
  }
}

export function Validator(metaData: { rules: ValidatorRuleConstructor<any>[] }): ClassDecorator {
  return target => {
    // 注册
    const rule = metaData.rules as ValidatorRuleConstructor<any>[];

    const validator = {
      ruleMethod: {},
      typeMessage: new Map(),
    };

    rule.forEach(Ctor => {
      const ruleFn = new Ctor();

      const ruleMap = Reflect.getMetadata(RULE_MAP, Ctor) || {};

      const propertyNames = Object.getOwnPropertyNames(ruleMap);

      propertyNames.forEach(value => validator.ruleMethod[value] = [ruleMap[value].bind(ruleFn), Ctor]);

      const message = Reflect.getMetadata(TYPE_MESSAGE, Ctor);

      message && validator.typeMessage.set(Ctor, message.bind(ruleFn));
    });

    Reflect.defineMetadata(VALIDATOR_RULE, validator, target);
  };
}
