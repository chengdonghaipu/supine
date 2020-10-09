import {includes, isArray, isFunction, isNumber, isPlainObject, isString, merge} from 'lodash';
import {ValidationRuleParser} from './rules/validation-rule-parser';
import {CdMessage} from './message';

function str_replace(
  findArr: string[],
  replaceValueArr: string[],
  target: string
): string {
  const _findArr = [...findArr];
  findArr = findArr.map(value => {
    return '(' + value + ')';
  });
  target = target.replace(
    new RegExp(findArr.join('|'), 'g'),
    (substring, args) => {
      if (substring) {
        const value = replaceValueArr[_findArr.indexOf(substring)];
        return value ? value : '';
      }
      return substring;
    }
  );
  return target;
}

export interface ValidFn {
  [propName: string]: (
    value: any,
    rule: any[],
    dataMap?: Map<string, any>
  ) => boolean | string;
}

export interface ValidatorClass {
  // 验证规则默认提示信息
  typeMsg?: { [key: string]: any };

  // 被验证的数据!
  dataMap?: Map<string, any>;
}

export interface ValidatorFnConstructor {
  new(...args: any[]): ValidatorClass;
}

export class Validator {
  static customRuleF: ValidFn = {};

  static customAfterF = {};

  static customTypeMsg: { [key: string]: any } = {};

  static validatorFnInstance: ValidatorClass[] = [];

  private _singleRules: string;
  private _singleData: any;
  private _singleMsg: string;
  // 需要验证该字段的验证规则。
  protected implicitRules = [
    'required',
    'filled',
    'requiredWith',
    'requiredWithAll',
    'requiredWithout',
    'requiredWithoutAll',
    'requiredIf',
    'requiredUnless',
    'accepted',
    'present'
  ];

  protected rules: { [key: string]: any } = {};

  protected ruleNameMap: { [key: string]: Array<string[] | string> } = {};

  protected implicitAttributes: { [key: string]: any } = {};

  public customMessages: { [key: string]: any } = [];

  private _msg: CdMessage = new CdMessage();
  // 所有注册的“后”回调。
  protected afters = [];

  private _isBatch = false;

  protected data;

  protected dataMap: Map<string, any> = new Map<string, any>();

  static registered(validatorClass: ValidatorFnConstructor[] = []) {
    validatorClass.forEach(value => {
      const _validatorFn = new value();
      Validator.validatorFnInstance.push(_validatorFn);
      if (isPlainObject((<any>_validatorFn).__validatorFn)) {
        merge(Validator.customRuleF, (<any>_validatorFn).__validatorFn);
      }
      if (isPlainObject((<any>_validatorFn).__typeMsg)) {
        merge(Validator.customTypeMsg, (<any>_validatorFn).__typeMsg);
      }
      if (isPlainObject((<any>_validatorFn).__afterF)) {
        merge(Validator.customAfterF, (<any>_validatorFn).__afterF);
      }
    });
  }

  constructor();
  constructor(rules: string);
  constructor(rules: string, data: any);
  constructor(rules: string, data: any, messages: string);
  constructor(rules: { [key: string]: any });
  constructor(rules: { [key: string]: any }, data: any);
  constructor(rules: { [key: string]: any }, data: any, messages: { [key: string]: any });
  constructor(rules?: any, data?: any, messages?: any) {
    if (rules && (isString(rules) || isPlainObject(rules))) {
      if (isString(rules)) rules = {'': rules};
      this.setRules(rules);
    }
    if (data && (isString(data) || isPlainObject(data))) {
      if (isString(data)) data = {'': data};
      this.parseData(data);
    }
    if (messages && (isString(messages) || isPlainObject(messages))) {
      if (isString(messages)) messages = {'': messages};
      merge(this.customMessages, messages);
    }
  }

  private parseData(data, _parent?: string) {
    if (isPlainObject(data)) {
      for (const dataKey in data) {
        this.dataMap.set(
          _parent ? `${_parent}.${dataKey}` : dataKey,
          data[dataKey]
        );
        if (isPlainObject(data[dataKey])) {
          this.parseData(
            data[dataKey],
            `${_parent ? _parent + '.' : ''}${dataKey}`
          );
        }
      }
    }
  }

  batch(isBatch: boolean = false): this {
    this._isBatch = isBatch;
    return this;
  }

  pipe() {
  }

  make(
    rules?: { [key: string]: any },
    data?: { [key: string]: any },
    messages?: { [key: string]: any }
  ): this {
    if (messages) {
      merge(this.customMessages, messages ? messages : {});
    }
    if (data) {
      this.data = data;
    }

    if (isPlainObject(rules)) {
      this.setRules(rules);
    }

    if (data) {
      this.parseData(data);
    }

    for (const customAfterFKey in Validator.customAfterF) {
      if (Validator.customAfterF.hasOwnProperty(customAfterFKey)) {
        this.registerAfterF(Validator.customAfterF[customAfterFKey]);
      }
    }
    return this.clearMsg().passes();
  }

  // 添加验证后回调。
  public registerAfterF(callback: (that: this) => void) {
    this.afters.push(() => callback(this));
    return this;
  }

  private valid(name, ruleKey, rules, value) {
    let validResult: boolean | string = false;
    validResult = Validator.customRuleF[ruleKey](
      value,
      rules[ruleKey],
      this.dataMap
    );
    if (validResult) {
      this.pmsg(name, ruleKey, rules, validResult, value);
    }
    return validResult;
  }

  private pmsg(name, ruleKey, rules, validResult, value) {
    let _customMsg = this.customMessages[
      `${name}.${ruleKey}`
      ];
    if (_customMsg || isString((_customMsg = validResult))) {
      this.addMsg(name, _customMsg);
    } else {
      this.message(name, ruleKey, rules[ruleKey], value);
    }
  }

  // 确定数据是否通过验证规则。
  private passes() {
    // 注册数据
    Validator.validatorFnInstance.forEach(
      value => {
        value.dataMap = this.dataMap;
      }
    );
    // @ts-ignore
    Validator.customRuleF.dataMap = this.dataMap;
    for (const rulesKey in this.rules) {
      if (isPlainObject(this.rules[rulesKey])) {
        const _rules = this.rules[rulesKey],
          _ruleNames = Object.keys(_rules),
          _isRequired = _ruleNames.some(value =>
            includes(this.implicitRules, value)
          );
        const _value = this.dataMap.get(rulesKey);
        if (_isRequired || '' !== _value) {
          for (const ruleNameMapKey of this.ruleNameMap[rulesKey]) {
            if (isString(ruleNameMapKey)) {
              if (this.hasRule(ruleNameMapKey)) {
                // 验证通过
                if (!this.valid(rulesKey, ruleNameMapKey, _rules, _value)) {
                  this.clearMsg();
                  break;
                }
              } else {
                console.error(`该规则 ${ruleNameMapKey} 不存在!`);
              }
            } else if (isArray(ruleNameMapKey)) {
              const res = ruleNameMapKey.filter(v => {
                if (this.hasRule(v)) {
                  return this.valid(rulesKey, v, _rules, _value);
                } else {
                  console.error(`该规则 ${v} 不存在!`);
                  return true;
                }
              });
              // 验证通过
              if (!res.length) {
                this.clearMsg();
                break;
              }
            }
          }
        }
      }
    }
    return this;
  }

  addMsg(key: string, _msg: string) {
    this._msg.add(key, _msg);
  }

  private message(validName: string, rulesKey: string, rules: any[], _value) {
    const _arr = ['between', 'max', 'min', 'size'],
      type = isString(_value)
        ? 'string'
        : isArray(_value)
          ? 'array'
          : isNumber(+_value) && +_value + '' === _value + '' ? 'numeric' : '';
    if (includes(_arr, rulesKey) && type) {
      const msgs = str_replace(
        [':attribute', ':min', ':max', ':size'],
        [validName, rules[0], rules[1] ? rules[1] : rules[0], rules[0]],
        Validator.customTypeMsg[rulesKey][type]
      );
      this.addMsg(validName, msgs);
    } else {
      const _msg = str_replace(
        [':attribute', ':rule', ':min', ':max', ':other', ':values', ':value'],
        [
          validName,
          rules[0],
          rules[0],
          rules[1] ? rules[1] : rules[0],
          rules[0],
          rules.join(','),
          rules[1]
        ],
        Validator.customTypeMsg[rulesKey]
      );
      this.addMsg(validName, _msg);
    }
  }

  fails(): boolean {
    this.afters.forEach(value => value());
    return this._msg.isNotEmpty();
  }

  getMessages(): { [key: string]: string[] } | string[] {
    const _msg = this._msg.getMessages();
    const _msgkeys = Object.keys(_msg);
    if (_msgkeys.length === 1 && !_msgkeys[0]) {
      return _msg[''];
    }
    return _msg;
  }

  getNgMsg(key: string): { [key: string]: string | boolean } | null {
    return this.fails() ? {[key]: this._msg.first(key), error: true} : null;
  }

  clearMsg(): this {
    this._msg.clear();
    return this;
  }

  hasRule(ruleName: string): boolean {
    return isFunction(Validator.customRuleF[ruleName]);
  }

  setRules(rules): this {
    this.rules = {};

    this.addRules(rules);

    return this;
  }

  addRules(rules): this {
    const _response = new ValidationRuleParser().explode(rules);
    merge(this.rules, _response.rules);
    merge(this.ruleNameMap, _response.ruleNameMap);
    merge(this.implicitAttributes, _response.implicitAttributes);
    return this;
  }
}
