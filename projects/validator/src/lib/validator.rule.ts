import {DefaultMessage} from './type-message';
import {Rule} from './rule';


export class ValidatorRule {

  @DefaultMessage()
  defaultMessage(filedName: string, ruleName: string, params, value): string {
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
      confirmed: `${filedName} 和确认字段 ${params[0]} 不一致`,
      dateFormat: `${filedName} 与给定的格式 ${params[0]} 不符合`,
      different: `${filedName} 必须不同于 ${params[0]}`,
      digits: `${filedName} 必须是 ${params[0]} 位`,
      digitsBetween: `${filedName} 必须在 ${params[0]} 和 ${params[1]} 位之间`,
      email: `${filedName} 必须是一个合法的电子邮件地址`,
      in: `${filedName} 必须是 ${params.join(',')} 其中之一`,
      integer: `${filedName} 必须是个整数`,
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
      // requiredIf: `当 ${params[0]} 是 ${params[1]} 的时候 ${filedName} 字段是必须的`,
      // requiredUnless: `${filedName} 字段是必须的，除非 :other 是在 :values 中`,
      // requiredWith: '当 :values 中有任意一个字段存在时 ${filedName} 字段是必须的 ',
      // requiredWithAll: '当 :values 都存在的时候 ${filedName} 字段是必须的 ',
      // requiredWithout:
      //   '当 :values 中有任意一个字段不存在时 ${filedName} 字段是必须的 ',
      // requiredWithoutAll:
      //   '当 没有一个 :values 是存在的时候 ${filedName} 字段是必须的 ',
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

  @Rule()
  in(value: any, params: string[]) {
    console.log(value, params);
    return true;
  }
}
