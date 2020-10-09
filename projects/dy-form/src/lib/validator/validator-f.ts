import {gt, gte, includes, isArray, isEqual, isInteger, isNumber, isRegExp, isString, lt, lte} from 'lodash';
import {RuleError} from './errors/rule-error';
import {isF, isRulesNotEmpty, onlyOneRuleParam, parseRule, ratherDate, requiredF, ruleOfNotParam, sizeF} from './tool';
import {RuleF} from './decorator/rule';
import {TypeMsg} from './decorator/typeMsg';
import {format, isDate} from 'date-fns';

export class ValidatorF {
  // 验证规则默认提示信息
  @TypeMsg()
  public typeMsg = {
    accepted: ':attribute 必须是yes、on或者1或者true',
    after: ':attribute 必须是 :other 之后的一个日期',
    afterOrEqual: ':attribute 必须是 :other 之后或相同的一个日期',
    alpha: ':attribute 只能是字母',
    alphaDash: ':attribute 只能包含字母、数字、中划线或下划线',
    alphaNum: ':attribute 只能包含字母、数字',
    array: ':attribute 必须是数组',
    before: ':attribute 必须是 :other 之前的一个日期',
    beforeOrEqual: ':attribute 必须是 :other 之前或相同的一个日期',
    between: {
      numeric: ':attribute 必须在 :min 到 :max 之间',
      string: ':attribute 必须在 :min 到 :max 个字符之间',
      array: ':attribute 必须在 :min 到 :max 长度之间'
    },
    boolean: ':attribute 必须是 true 或 false',
    confirmed: ':attribute 和确认字段 :other 不一致',
    dateFormat: ':attribute 与给定的格式 :rule 不符合',
    different: ':attribute 必须不同于 :other',
    digits: ':attribute 必须是 :rule 位',
    digitsBetween: ':attribute 必须在 :min 和 :max 位之间',
    distinct: ':attribute 字段具有重复值',
    email: ':attribute 必须是一个合法的电子邮件地址',
    in: ':attribute 必须在 :values 范围内',
    inArray: ':attribute 字段不存在于 :rule',
    integer: ':attribute 必须是个整数',
    json: ':attribute必须是一个合法的 JSON 字符串',
    max: {
      numeric: '最大数字为 :max ',
      string: ':最大长度为 :max 字符',
      array: ':attribute 的最大个数为 :max 个'
    },
    min: {
      numeric: '最小数字为 :min ',
      string: '最小长度为 :min 字符',
      array: ':attribute 的最小个数为 :min 个'
    },
    notIn: ':attribute 不能在 :rule 范围内',
    numeric: ':attribute 必须是数字',
    present: ':attribute 字段必须存在',
    regex: ':attribute 格式是无效的',
    required: ':attribute 字段是必须的',
    requiredIf: '当 :other 是 :value 的时候 :attribute 字段是必须的 ',
    requiredUnless: ':attribute 字段是必须的，除非 :other 是在 :values 中',
    requiredWith: '当 :values 中有任意一个字段存在时 :attribute 字段是必须的 ',
    requiredWithAll: '当 :values 都存在的时候 :attribute 字段是必须的 ',
    requiredWithout:
      '当 :values 中有任意一个字段不存在时 :attribute 字段是必须的 ',
    requiredWithoutAll:
      '当 没有一个 :values 是存在的时候 :attribute 字段是必须的 ',
    same: ':attribute 和 :other 的值 必须匹配',
    size: {
      numeric: ':attribute 必须是 :size 位',
      string: ':attribute 必须是 :size 个字符',
      array: ':attribute 必须包括 :size 项'
    },
    number: ':attribute 必须是数字',
    float: ':attribute 必须是浮点数',
    filled: ':attribute 字段是必须的',
    chs: ':attribute 只能是汉字',
    chsAlpha: ':attribute 只能是汉字、字母',
    chsAlphaNum: ':attribute 只能是汉字、字母和数字',
    egt: ':attribute 必须大于等于 :rule',
    gt: ':attribute 必须大于 :rule',
    elt: ':attribute 必须小于等于 :rule',
    lt: ':attribute 必须小于 :rule',
    eq: ':attribute 必须等于 :rule'
  };

  public dataMap: Map<string, any> = new Map<string, any>();

  constructor() {}

  /**
   * 该值为 null.
   * 该值为空字符串。
   * 该值为空数组或空的 可数 对象。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  required(value: any, rule?: string[]): boolean {
    return requiredF('required', value, rule, this.dataMap);
  }

  /**
   * 只要在指定的其他字段中有任意一个字段存在时，被验证的字段就必须存在并且不能为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredWith(value: any, rule: string[]): boolean {
    return requiredF('requiredWith', value, rule, this.dataMap);
  }

  /**
   * 只有当所有的其他指定字段全部存在时，被验证的字段才必须存在并且不能为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredWithAll(value: any, rule: string[]): boolean {
    return requiredF('requiredWithAll', value, rule, this.dataMap);
  }

  /**
   * 只要在其他指定的字段中有任意一个字段不存在，被验证的字段就必须存在且不为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredWithout(value: any, rule: string[]): boolean {
    return requiredF('requiredWithout', value, rule, this.dataMap);
  }

  /**
   * 只有当所有的其他指定的字段都不存在时，被验证的字段才必须存在且不为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredWithoutAll(value: any, rule: string[]): boolean {
    return requiredF('requiredWithoutAll', value, rule, this.dataMap);
  }

  /**
   * 如果指定的其它字段（ filed ）等于任何一个 value 时，被验证的字段必须存在且不为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredIf(value: any, rule: string[]): boolean {
    return requiredF('requiredIf', value, rule, this.dataMap);
  }

  /**
   * 如果指定的其它字段（ filed ）等于任何一个 value 时，被验证的字段不必存在。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  requiredUnless(value: any, rule: string[]): boolean {
    return requiredF('requiredUnless', value, rule, this.dataMap);
  }

  /**
   * 验证的字段在存在时不能为空。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  filled(value: any, rule: string[]): boolean {
    ruleOfNotParam('filled', rule);
    return value ? this.required(value, rule) : false;
  }

  /**
   * 验证的字段必须为 yes、 on、 1、或 true。这在确认「服务条款」是否同意时相当有用
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  accepted(value: any, rule: string[]): boolean {
    ruleOfNotParam('accepted', rule);
    const _rules = ['yes', 'on', 1, true];
    return !includes(_rules, value);
  }

  /**
   * 验证的字段必须存在于输入数据中，但可以为空
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  present(value: any, rule: string[]): boolean {
    ruleOfNotParam('present', rule);
    return value === undefined;
  }

  /**
   * 验证的字段必须和 filed 的字段值一致。例如，如果要验证的字段是 password，输入中必须存在匹配的 filed 字段。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  confirmed(value: any, rule: string[]): boolean {
    const _rules = isRulesNotEmpty('confirmed', value, rule);
    return !(
      this.dataMap.has(_rules[0]) && value === this.dataMap.get(_rules[0])
    );
  }

  /**
   * 给定字段必须与验证的字段匹配。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  same(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('same', value, rule);
    return !(
      this.dataMap.has(_rules[0]) && value === this.dataMap.get(_rules[0])
    );
  }

  /**
   * 验证的字段值必须与字段 (field) 的值不同。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  different(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('different', value, rule);
    return this.dataMap.has(_rules[0]) && value === this.dataMap.get(_rules[0]);
  }

  /**
   * 验证的字段必须是给定日期之前的值
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  before(value: any, rule: string[]): boolean {
    return ratherDate('before', value, rule);
  }

  /**
   * 验证的字段必须是给定日期之后的值
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  after(value: any, rule: string[]): boolean {
    return ratherDate('after', value, rule);
  }

  /**
   * 验证的字段必须是给定日期之前或等于之前的值
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  beforeOrEqual(value: any, rule: string[]): boolean {
    return ratherDate('beforeOrEqual', value, rule);
  }

  /**
   * 验证的字段必须是给定日期之后或等于之后的值
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  afterOrEqual(value: any, rule: string[]): boolean {
    return ratherDate('afterOrEqual', value, rule);
  }

  /**
   * 验证的字段必须等于给定的日期。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  dateEqual(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('dateEqual', value, rule);
    if (isDate(_rules[0]) && isDate(value)) {
      return isEqual(_rules[0], value);
    }
    return;
  }

  /**
   * 验证的字段必须与给定的格式相匹配
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  dateFormat(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('dateEqual', value, rule);
    const date = format(value, _rules[0]);
    return isDate(date);
  }

  @RuleF()
  gt(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('gt', value, rule),
      otherData = this.dataMap.has(_rules[0]) && this.dataMap.get(_rules[0]);
    if (isEqual(otherData, value)) {
      return true;
    }
    return otherData !== undefined ? gt(otherData, value) : true;
  }

  @RuleF()
  lt(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('lt', value, rule),
      otherData = this.dataMap.has(_rules[0]) && this.dataMap.get(_rules[0]);
    if (isEqual(otherData, value)) {
      return true;
    }
    return otherData !== undefined
      ? lt(otherData, value) && !isEqual(otherData, value)
      : true;
  }

  @RuleF()
  gte(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('gte', value, rule),
      otherData = this.dataMap.has(_rules[0]) && this.dataMap.get(_rules[0]);
    return otherData !== undefined ? gte(otherData, value) : true;
  }

  @RuleF()
  lte(value: any, rule: string[]): boolean {
    const _rules = onlyOneRuleParam('lte', value, rule),
      otherData = this.dataMap.has(_rules[0]) && this.dataMap.get(_rules[0]);
    return otherData !== undefined ? lte(otherData, value) : true;
  }

  /**
   * 验证中的字段必须具有最小值。字符串、数字、数组的计算方式都用 size 方法进行评估
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  min(value: any, rule: string[]): boolean {
    return sizeF('min', value, rule);
  }

  /**
   * 验证中的字段必须小于或等于 value。字符串、数字、数组的计算方式都用 size 方法进行评估。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  max(value: any, rule: string[]): boolean {
    return sizeF('max', value, rule);
  }

  /**
   * 验证的字段的大小必须在给定的 min 和 max 之间。字符串、数字、数组的计算方式都用 size 方法进行评估。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  between(value: any, rule: string[]): boolean {
    const _rules = parseRule(rule);
    if (_rules.length !== 2) {
      throw new RuleError(
        `between 规则错误 规则参数个数只能有两个！ 例如: between:min,max`
      );
    }
    if (+_rules[0] + '' !== _rules[0] || +_rules[1] + '' !== _rules[1]) {
      throw new RuleError('between 的参数 必须是数字! 例如: between:20,25');
    }
    if (isString(value) || isArray(value)) {
      return value.length < +_rules[0] && value.length > +_rules[1];
    } else if (isNumber(value)) {
      return value < +_rules[0] && value > +_rules[1];
    }
  }

  /**
   * 验证的字段必须具有与给定值匹配的大小。对于字符串来说，value 对应于字符数。对于数字来说，value 对应于给定的整数值。
   * 对于数组来说， size 对应的是数组的 count 值
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  size(value: any, rule: string[]): boolean {
    return sizeF('size', value, rule);
  }

  /**
   * 数字
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  numeric(value: any, rule?: string[]): boolean {
    ruleOfNotParam('numeric', rule);
    return !(isNumber(+value) && +value + '' === value + '');
  }

  /**
   * 整型
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  integer(value: any, rule: string[]): boolean {
    ruleOfNotParam('integer', rule);
    return !(isInteger(+value) && +value + '' === value + '');
  }

  /**
   * 数组
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  array(value: any, rule: string[]): boolean {
    ruleOfNotParam('array', rule);
    return !isArray(value);
  }

  /**
   * 验证的字段必须包含在给定的值列表中
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  in(value: any, rule: string[]): boolean {
    const _rules = parseRule(rule);
    return !includes(_rules, value);
  }

  /**
   * 验证的字段不能包含在给定的值列表中
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  notIn(value: any, rule: string[]): boolean {
    return !this.in(value, rule);
  }

  /**
   * 验证的字段必须完全是字母的字符
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  alpha(value: any, rule: string[]): boolean {
    ruleOfNotParam('alpha', rule);
    return !isF('alpha', value);
  }

  /**
   * 验证的字段可能具有字母、数字、破折号（ - ）以及下划线（ _ ）。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  alphaDash(value: any, rule: string[]): boolean {
    ruleOfNotParam('alphaDash', rule);
    return !isF('alphaDash', value);
  }

  /**
   * 只包含字母、数字
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  alphaNum(value: any, rule: string[]): boolean {
    ruleOfNotParam('alphaNum', rule);
    return !isF('alphaNum', value);
  }

  /**
   * 只允许汉字、字母、数字和下划线_及破折号-
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  chsDash(value: any, rule: string[]): boolean {
    ruleOfNotParam('chsDash', rule);
    return !isF('chsDash', value);
  }

  /**
   * 只允许汉字
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  chs(value: any, rule: string[]): boolean {
    ruleOfNotParam('chs', rule);
    return !isF('chs', value);
  }

  /**
   * 只允许汉字、字母
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  chsAlpha(value: any, rule: string[]): boolean {
    ruleOfNotParam('chsAlpha', rule);
    return !isF('chsAlpha', value);
  }

  /**
   * 验证的字段必须完全是汉字、字母和数字。
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  chsAlphaNum(value: any, rule: string[]): boolean {
    ruleOfNotParam('chsAlphaNum', rule);
    return !isF('chsAlphaNum', value);
  }

  /**
   * 验证的字段必须是邮箱
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  email(value: any, rule: string[]): boolean {
    ruleOfNotParam('email', rule);
    return !isF('email', value);
  }

  /**
   * 验证的字段必须完全是浮点数
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  float(value: any, rule: string[]): boolean {
    ruleOfNotParam('float', rule);
    return !isF('float', value);
  }

  /**
   * 验证的字段必须是手机号码
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  phoneNum(value: any, rule: string[]): boolean {
    ruleOfNotParam('phoneNum', rule);
    return !isF('phoneNum', value);
  }

  /**
   * 验证的字段必须是电话号码
   * @param value
   * @param  rule
   * @returns boolean
   */
  @RuleF()
  telNumber(value: any, rule: string[]): boolean {
    ruleOfNotParam('telNumber', rule);
    return !isF('telNumber', value);
  }

  /**
   * 验证的字段必须与给定的正则表达式匹配。
   * 注意： 当使用 regex 规则时，你必须使用数组，而不是使用 | 分隔符，特别是如果正则表达式包含 | 字符。
   * @param value
   * @param rule
   * @returns boolean
   */
  @RuleF()
  regex(value: any, rule: any[]): boolean {
    const _rules = onlyOneRuleParam('regex', value, rule);
    if (!isRegExp(_rules[0])) {
      _rules[0] = new RegExp(_rules[0]);
    }
    return !_rules[0].test(value);
  }
}
