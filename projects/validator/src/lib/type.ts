
export type ValidatorRuleConstructor<T> = new() => T;

export type TargetMap = Map<string, any>;

export type RuleFn<V = any> = (value: V, params: any, targetMap: TargetMap) => boolean | string;

export type MessageFn = (filedName: string, ruleName: string, params, value) => string;

export type GroupRule = Array<Array<[string, any[]] | [string]>> | RuleFn[];

export type RuleType = string | string[] | RuleFn | RuleFn[];

export type CustomMessage = {[key: string]: string | ({[key: string]: string})};

export interface ValidatorMetaData {
  ruleMethod: {[key: string]: [RuleFn, ValidatorRuleConstructor<any>]};
  typeMessage: Map<ValidatorRuleConstructor<any>, MessageFn>;
}
