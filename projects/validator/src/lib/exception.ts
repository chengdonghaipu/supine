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
