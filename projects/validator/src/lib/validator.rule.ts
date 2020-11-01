import {DefaultMessage} from './type-message';
import {Rule} from './rule';
import {isArray, isBase64, isBaseStr, isBoolean, isDate, isFloat, isHash, isIP, isNumber, isObject, isString} from './typeof';
import {CheckParamIncludeException, CheckParamNotException, CheckParamSizeException} from './exception';

function regExp(ruleName: string, value) {
  // tslint:disable-next-line:variable-name
  let _result = false;
  switch (ruleName) {
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
    case 'phoneNum': {
      // 验证的字段必须是手机号码。
      _result = /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
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

export class ValidatorRule {
  @DefaultMessage()
  defaultMessage(filedName: string, ruleName: string, params, value): string {
    if (!params) {
      params = [];
    }
    const typeMsg = {
      accepted: `${filedName} 必须是yes、on或者1或者true`,
      after: `${filedName} 必须是 ${params[0]} 之后的一个日期`,
      afterOrEqual: `${filedName} 必须是 ${params[0]} 之后或相同的一个日期`,
      alpha: `${filedName} 只能是字母`,
      alphaDash: `${filedName} 只能包含字母、数字、中划线或下划线`,
      alphaNum: `${filedName} 只能包含字母、数字`,
      array: `${filedName} 必须是数组`,
      before: `${filedName} 必须是 ${params[0]} 之前的一个日期`,
      beforeOrEqual: `${filedName} 必须是 ${params[0]} 之前或相同的一个日期`,
      between: {
        number: `${filedName}值 必须在 ${params[0]} 到 ${params[1]} 之间`,
        string: `${filedName}字符数 必须在 ${params[0]} 到 ${params[1]} 个字符之间`,
        array: `${filedName}元素个数 必须在 ${params[0]} 到 ${params[1]} 之间`
      },
      boolean: `${filedName} 必须是 true 或 false`,
      booleanString: `${filedName} 必须是 'true' 或 'false'`,
      confirmed: `${filedName} 和确认字段 ${params[0]} 不一致`,
      dateFormat: `${filedName} 与给定的格式 ${params[0]} 不符合`,
      different: `${filedName} 必须不同于 ${params[0]}`,
      digits: `${filedName} 必须是 ${params[0]} 位`,
      digitsBetween: `${filedName} 必须在 ${params[0]} 和 ${params[1]} 位之间`,
      email: `${filedName} 必须是一个合法的电子邮件地址`,
      in: `${filedName} 必须是 ${params.join(',')} 其中之一`,
      contains: `${filedName} 必须包含 ${params[0]}`,
      notContains: `${filedName} 不能包含 ${params[0]}`,
      integer: `${filedName} 必须是个整数`,
      safeInteger: `${filedName} 必须是safeInteger`,
      date: `${filedName} 必须是 Date`,
      json: `${filedName} 必须是一个合法的 JSON 字符串`,
      max: {
        number: `${filedName} 最大数字为 ${params[1]}`,
        string: `${filedName} 最大长度为 ${params[1]} 字符`,
        array: `${filedName} 的最大个数为 ${params[1]} 个`
      },
      min: {
        number: `${filedName}最小数字为 ${params[0]} `,
        string: `${filedName}最小长度为 ${params[0]} 字符`,
        array: `${filedName} 的最小元素个数为 ${params[0]} 个`
      },
      notIn: `${filedName} 不能在 ${params.join(',')} 范围内`,
      numeric: `${filedName} 必须是数字`,
      regex: `${filedName} 格式是无效的`,
      required: `${filedName} 字段是必须的`,
      same: `${filedName} 和 ${params[0]} 的值 必须匹配`,
      size: {
        number: `${filedName} 必须是 ${params[0]} 位`,
        string: `${filedName} 必须是 ${params[0]} 个字符`,
        array: `${filedName} 必须包括 ${params[0]} 项`
      },
      maxLength: {
        number: `${filedName} 最大长度 ${params[0]} 个字符`,
        string: `${filedName} 最大长度 ${params[0]} 个字符`,
        array: `${filedName} 最大长度 ${params[0]} 项`
      },
      minLength: {
        number: `${filedName} 最小长度 ${params[0]} 个字符`,
        string: `${filedName} 最小长度 ${params[0]} 个字符`,
        array: `${filedName} 最小长度 ${params[0]} 项`
      },
      number: `${filedName} 必须是数字`,
      float: `${filedName} 必须是浮点数`,
      hash: `${filedName} 必须符合 hash[${params[0]}] 规则`,
      base32: `${filedName} 必须符合 base32 规则`,
      base58: `${filedName} 必须符合 base58 规则`,
      base64: `${filedName} 必须符合 base64 规则`,
      base64UrlSafe: `${filedName} 必须符合 base64UrlSafe 规则`,
      ipV4: `${filedName} 必须符合 IPV4 规则`,
      ipV6: `${filedName} 必须符合 IPV6 规则`,
      chs: `${filedName} 只能是汉字`,
      chsAlpha: `${filedName} 只能是汉字、字母`,
      chsAlphaNum: `${filedName} 只能是汉字、字母和数字`,
      egt: `${filedName} 必须大于等于 ${params[0]}`,
      gt: `${filedName} 必须大于 ${params[0]}`,
      elt: `${filedName} 必须小于等于 ${params[0]}`,
      lt: `${filedName} 必须小于 ${params[0]}`,
      eq: `${filedName} 必须等于 ${params[0]}`
    };

    const filter = ['minLength', 'maxLength', 'size', 'min', 'max', 'between'];

    if (filter.includes(ruleName)) {
      if (typeof value === 'number') {
        return typeMsg[ruleName].number;
      } else if (typeof value === 'string') {
        return typeMsg[ruleName].string;
      } else if (Array.isArray(value)) {
        return typeMsg[ruleName].array;
      } else {
        throw Error(`规则${ruleName} 所校验的值 只能为 number或者string或者array`);
      }
    }

    return typeMsg[ruleName];
  }

  /**
   * 字段是必填的
   * @param value
   * @param params
   */
  @Rule()
  required(value, params) {
    CheckParamNotException('required', params);
    return value === null || value === '' || (isArray(value) && !value.length) ||
      (isObject(value) && !Object.keys(value).length);
  }

  /**
   * 只允许为数组类型
   * @param value
   * @param params
   */
  @Rule()
  array(value, params) {
    CheckParamNotException('array', params);
    return !Array.isArray(value);
  }

  /**
   * 只允许为数字类型
   * @param value
   * @param params
   */
  @Rule()
  number(value, params) {
    CheckParamNotException('number', params);
    return !isNumber(value);
  }

  /**
   * 必须为boolean
   * @param value
   * @param params
   */
  @Rule()
  boolean(value, params) {
    CheckParamNotException('boolean', params);
    return !isBoolean(value);
  }

  /**
   * 必须为 'true' || 'false'
   * @param value
   * @param params
   */
  @Rule()
  booleanString(value, params) {
    CheckParamNotException('booleanString', params);
    return !(value === 'true' || value === 'false');
  }

  /**
   * 只允许为字符串
   * @param value
   * @param params
   */
  @Rule()
  string(value, params) {
    CheckParamNotException('string', params);
    return !isString(value);
  }

  /**
   * 只允许是数字 可以是字符串数字
   * @param value
   * @param params
   */
  @Rule()
  numeric(value, params) {
    CheckParamNotException('numeric', params);
    return !(!isNaN(+value) && (isNumber(value) || isString(value)));
  }

  /**
   * 必须是 Date类型
   * @param value
   * @param params
   */
  @Rule()
  date(value, params) {
    CheckParamNotException('date', params);
    return !(isDate(value));
  }

  /**
   * 验证的字段必须完全是浮点数
   * @param value
   * @param params
   */
  @Rule()
  float(value, params) {
    CheckParamNotException('float', params);
    return !isFloat(value);
  }

  /**
   * 整型
   * @param value
   * @param params
   */
  @Rule()
  integer(value, params) {
    CheckParamNotException('integer', params);
    return !Number.isInteger(value);
  }

  /**
   * safeInteger
   * @param value
   * @param params
   */
  @Rule()
  safeInteger(value, params) {
    CheckParamNotException('safeInteger', params);
    return !Number.isSafeInteger(value);
  }

  /**
   * 必须符合 base32 规则
   * @param value
   * @param params
   */
  @Rule()
  base32(value, params) {
    CheckParamNotException('base32', params);
    return !isBaseStr(value, 32);
  }

  /**
   * 必须符合 base58 规则
   * @param value
   * @param params
   */
  @Rule()
  base58(value, params) {
    CheckParamNotException('base58', params);
    return !isBaseStr(value, 58);
  }

  /**
   * 必须符合 base64 规则
   * @param value
   * @param params
   */
  @Rule()
  base64(value, params) {
    CheckParamNotException('base64', params);
    return !isBase64(value, false);
  }

  /**
   * 必须符合 base64UrlSafe 规则
   * @param value
   * @param params
   */
  @Rule()
  base64UrlSafe(value, params) {
    CheckParamNotException('base64UrlSafe', params);
    return !isBase64(value, true);
  }

  /**
   * 必须符合 IPV4 规则
   * @param value
   * @param params
   */
  @Rule()
  ipV4(value, params) {
    CheckParamNotException('ipV4', params);
    return !isIP(value, '4');
  }

  /**
   * 必须符合 IPV6 规则
   * @param value
   * @param params
   */
  @Rule()
  ipV6(value, params) {
    CheckParamNotException('ipV6', params);
    return !isIP(value, '6');
  }

  /**
   * 只允许汉字
   * @param value
   * @param params
   */
  @Rule()
  chs(value, params) {
    CheckParamNotException('chs', params);
    return !regExp('chs', value);
  }

  /**
   * 只允许汉字、字母
   * @param value
   * @param params
   */
  @Rule()
  chsAlpha(value, params) {
    CheckParamNotException('chsAlpha', params);
    return !regExp('chsAlpha', value);
  }

  /**
   * 验证的字段必须完全是汉字、字母和数字。
   * @param value
   * @param params
   */
  @Rule()
  chsAlphaNum(value, params) {
    CheckParamNotException('chsAlphaNum', params);
    return !regExp('chsAlphaNum', value);
  }

  /**
   * 验证的字段必须是邮箱
   * @param value
   * @param params
   */
  @Rule()
  email(value, params) {
    CheckParamNotException('email', params);
    return !regExp('email', value);
  }

  /**
   * 验证的字段必须是手机号码
   * @param value
   * @param params
   */
  @Rule()
  phoneNum(value, params) {
    CheckParamNotException('phoneNum', params);
    return !regExp('phoneNum', value);
  }

  /**
   * 只允许汉字、字母、数字和下划线_及破折号-
   * @param value
   * @param params
   */
  @Rule()
  chsDash(value, params) {
    CheckParamNotException('chsDash', params);
    return !regExp('chsDash', value);
  }

  /**
   * 验证的字段可能具有字母、数字、破折号（ - ）以及下划线（ _ ）。
   * @param value
   * @param params
   */
  @Rule()
  alphaDash(value, params) {
    CheckParamNotException('alphaDash', params);
    return !regExp('alphaDash', value);
  }

  /**
   * 验证的字段必须完全是字母的字符
   * @param value
   * @param params
   */
  @Rule()
  alpha(value, params) {
    CheckParamNotException('alpha', params);
    return !regExp('alpha', value);
  }

  /**
   * 只包含字母、数字
   * @param value
   * @param params
   */
  @Rule()
  alphaNum(value, params) {
    CheckParamNotException('alphaNum', params);
    return !regExp('alphaNum', value);
  }

  /**
   * 验证的字段必须是电话号码
   * @param value
   * @param  params
   * @returns boolean
   */
  @Rule()
  telNumber(value, params) {
    CheckParamNotException('telNumber', params);
    return !regExp('telNumber', value);
  }

  /**
   * 包含 某个字符串片段
   * @param value
   * @param params
   */
  @Rule()
  contains(value, params) {
    CheckParamSizeException('contains', 1, params);
    if (!isString(value)) {
      return true;
    }
    return !(value.indexOf(params[0]) > -1);
  }

  /**
   * 不包含 某个字符串片段
   * @param value
   * @param params
   */
  @Rule()
  notContains(value, params) {
    CheckParamSizeException('notContains', 1, params);
    if (!isString(value)) {
      return true;
    }
    return !this.contains(value, params);
  }

  /**
   * hash 校验
   * @param value
   * @param params
   */
  @Rule()
  hash(value, params: unknown[]) {
    CheckParamSizeException('hash', 1, params);
    CheckParamIncludeException('hash', [
      'md5', 'md4', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b'
    ], params);
    return !isHash(value, params[0]);
  }

  @Rule()
  in(value, params: unknown[]) {
    return !params.includes(value);
  }

  @Rule()
  notIn(value, params: unknown[]) {
    return !this.in(value, params);
  }

  @Rule()
  max(value: any, params: string[]) {
    return false;
  }
}
