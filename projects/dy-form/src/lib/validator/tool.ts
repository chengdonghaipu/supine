import {isArray, isNumber, isPlainObject, isString, trim} from 'lodash';
import {RuleError} from './errors/rule-error';
import {isDate} from 'date-fns';

export type RequiredNames = 'requiredWith' | 'requiredWithAll' | 'requiredWithout' | 'requiredWithoutAll'
  | 'requiredIf' | 'requiredUnless' | 'required';

export function parseRule(rule: any[] | string): any[] {
  const _rules = isString(rule) && rule ? rule.split(',') : isArray(rule) ? rule : [];
  return _rules.map(value => isString(value) ? trim(value) : value);
}

export function isRulesNotEmpty(ruleName, value: any, rule: string[] | string, ex = ''): string[] {
  const _rules = parseRule(rule);
  if (!_rules.length) {
    throw new RuleError(`${ruleName} 规则参数不能为空！ 例如: ${ruleName}${ex ? ':filed1,filed2...' : ex}`);
  }
  return _rules;
}

export function onlyOneRuleParam(ruleName, value: any, rule: any[] | string, ex = ''): any[] {
  const _rules = isRulesNotEmpty(ruleName, value, rule, ex ? ex : 'filed');
  if (_rules.length > 1) {
    console.warn(`${ruleName} 规则的参数  只有第一个参数有效  多余的参数将被舍弃!`);
  }
  return _rules;
}

export function ruleOfNotParam(ruleName, rule: string[] | string) {
  const _rules = parseRule(rule);
  if (_rules.length > 0) {
    console.warn(`${ruleName} 不需要任何参数 如果传了参数将被舍弃! 例如: ${ruleName}`);
  }
}

export function sizeF(ruleName: 'size' | 'max' | 'min' | 'minLength' | 'maxLength', value: any, rule: string[] | string): boolean {
  const _rules = onlyOneRuleParam('size', value, rule);
  if (+_rules[0] + '' !== _rules[0]) {
    throw new RuleError('size 的参数 必须是数字! 例如: size:20');
  }
  if ((isString(value) && isNaN(+value)) || isArray(value)) {
    return ruleName === 'size' && value.length !== +_rules[0] ||
      ruleName === 'max' && value.length > +_rules[0] ||
      ruleName === 'min' && value.length < +_rules[0] ||
      ruleName === 'maxLength' && value.length > +_rules[0] ||
      ruleName === 'minLength' && value.length < +_rules[0];
  } else if (isNumber(value) || !isNaN(+value)) {
    return ruleName === 'size' && +value !== +_rules[0] ||
      ruleName === 'max' && +value > +_rules[0] ||
      ruleName === 'min' && +value < +_rules[0] ||
      ruleName === 'maxLength' && (value + '').length > +_rules[0] ||
      ruleName === 'minLength' && (value + '').length < +_rules[0];
  }
  return false;
}

export function requiredF(ruleName: RequiredNames, value: any, rule: string[] | string,
                          dataMap: Map<string, any>): boolean {
  let _rules = [];

  if (ruleName === 'required') {
    ruleOfNotParam('required', rule);
  } else {
    _rules = isRulesNotEmpty(ruleName, value, rule);
  }
  const required = value === null || value === '' || (isArray(value) && !value.length) ||
    (isPlainObject(value) && !Object.keys(value).length);

  if ((ruleName === 'requiredIf' || ruleName === 'requiredUnless') && _rules.length % 2 !== 0) {
    throw new RuleError(`${ruleName} 规则错误 规则参数个数只能为偶数！ 例如: ${ruleName}:filed1,value1,...`);
  }
  let _dataIsExit = false;
  switch (ruleName) {
    case 'requiredWith': {
      _dataIsExit = _rules.some(value1 => dataMap.has(value1));
      break;
    }
    case 'requiredWithAll': {
      _dataIsExit = _rules.every(value1 => dataMap.has(value1));
      break;
    }
    case 'requiredWithout': {
      _dataIsExit = _rules.some(value1 => !dataMap.has(value1));
      break;
    }
    case 'requiredWithoutAll': {
      _dataIsExit = _rules.every(value1 => !dataMap.has(value1));
      break;
    }
    case 'requiredIf':
    case 'requiredUnless': {
      _dataIsExit = _rules.some((value1, index) => {
        if (index % 2 === 0) {
          // tslint:disable-next-line:triple-equals
          return dataMap.has(value1) && dataMap.get(value1) == _rules[index + 1];
        }
      });
      break;
    }
  }
  return _dataIsExit ? ruleName === 'requiredUnless' ? !required :
    required : required;

}

export function ratherDate(ruleName: 'before' | 'beforeOrEqual' | 'afterOrEqual' | 'after',
                           value: any, rule: string[] | string): boolean {
  // tslint:disable-next-line:one-variable-per-declaration
  const _rules = onlyOneRuleParam(ruleName, value, rule),
    otherDate = this.dataMap.has(_rules[0]) && this.dataMap.get(_rules[0]);
  if (isDate(otherDate) && isDate(value)) {
    const _temp = +new Date(otherDate) - +new Date(value);
    return ruleName === 'before' && _temp <= 0 ||
      ruleName === 'after' && _temp >= 0 ||
      ruleName === 'beforeOrEqual' && _temp < 0 ||
      ruleName === 'beforeOrEqual' && _temp > 0;
  }
  return true;
}

export function isF(name, value) {
  let _result = false;
  switch (name) {
    case 'alpha': {
      // 验证的字段必须完全是字母的字符
      _result = /^[a-zA-Z]+$/.test(value);
      break;
    }
    case 'alphaDash': {
      // 验证的字段可能具有字母、数字、破折号（ - ）以及下划线（ _ ）。
      _result = /^[a-zA-Z0-9-_]+$/.test(value);
      break;
    }
    case 'chsDash': {
      // 只允许汉字、字母、数字和下划线_及破折号-
      _result = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/.test(value);
      break;
    }
    case 'chs': {
      // 只允许汉字
      _result = /^[\u4e00-\u9fa5]+$/.test(value);
      break;
    }
    case 'chsAlpha': {
      // 只允许汉字、字母
      _result = /^[\u4e00-\u9fa5a-zA-Z]+$/.test(value);
      break;
    }
    case 'chsAlphaNum': {
      // 只允许汉字、字母和数字
      _result = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
      break;
    }
    case 'alphaNum': {
      // 验证的字段必须完全是字母、数字。
      _result = /^[a-zA-Z0-9]+$/.test(value);
      break;
    }
    case 'email': {
      // 验证的字段必须是邮箱。
      _result = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(value);
      break;
    }
    case 'float': {
      // 验证的字段必须完全是浮点数。
      _result = /^(-?\d+)(\.\d+)?$/.test(value);
      break;
    }
    case 'phoneNum': {
      // 验证的字段必须是手机号码。
      _result = /^(-?\d+)(\.\d+)?$/.test(value);
      break;
    }
    case 'telNumber': {
      // 验证的字段必须是电话号码。
      _result = /^(-?\d+)(\.\d+)?$/.test(value);
      break;
    }
  }
  return _result;
}
