export type ValidatorRuleConstructor<T> = new() => T;

export type TargetMap = Map<string, any>;

export type RuleFn<V = any> = (value: V, params: any, targetMap: TargetMap) => boolean | string;

export type CustomRuleFn<V = any> = (value: V, targetMap: TargetMap) => boolean | string;

export type MessageFn = (filedName: string, ruleName: string, params, value) => string;

export type GroupRule = Array<Array<[string, any[]] | [string]>>
  | CustomRuleFn[]
  | Array<{ [key: string]: any[] | CustomRuleFn }>;

export type RuleType = string
  | string[]
  | CustomRuleFn
  | CustomRuleFn[]
  | Array<{ [key: string]: any[] | CustomRuleFn }>
  | { [key: string]: any[] | CustomRuleFn };

export type CustomMessage = { [key: string]: string | ({ [key: string]: string }) };

export interface ValidatorMetaData {
  ruleMethod: { [key: string]: [RuleFn, ValidatorRuleConstructor<any>] };
  typeMessage: Map<ValidatorRuleConstructor<any>, MessageFn>;
}

export type ParamType = 'String' | 'Number' | 'Boolean' | 'Undefined' | 'Null' | 'Array' | 'function' | 'Object' | 'RegExp' | 'Date';
