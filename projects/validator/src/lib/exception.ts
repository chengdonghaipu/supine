class RuleNotException extends Error {

  constructor(ruleName: string) {
    super(`规则${ruleName} 不存在`);
  }
}


class ParamNotException extends Error {

  constructor(ruleName: string) {
    super(`规则${ruleName} 不应该存在校验参数!`);
  }
}

class ParamSizeException extends Error {

  constructor(ruleName: string, paramSize: number) {
    super(`规则${ruleName} 有仅只有${paramSize}个参数!`);
  }
}

class ParamIncludeException extends Error {

  constructor(ruleName: string, paramContains: string[]) {
    super(`规则${ruleName} 只能为 ${paramContains.join(',')} 其中之一!`);
  }
}


export function CheckRuleNotException(rule, ruleName: string) {
  if (rule) {
    return;
  }
  throw new RuleNotException(ruleName);
}

export function CheckParamNotException(ruleName, params) {
  if (!params) {
    return;
  }
  throw new ParamNotException(ruleName);
}

export function CheckParamSizeException(ruleName, paramSize: number, params) {
  if (params && params.length === paramSize) {
    return;
  }
  throw new ParamSizeException(ruleName, paramSize);
}
export function CheckParamIncludeException(ruleName, paramContains: string[], params) {
  if (params && params.length === 1 && paramContains.includes(params[0])) {
    return;
  }
  throw new ParamIncludeException(ruleName, paramContains);
}
