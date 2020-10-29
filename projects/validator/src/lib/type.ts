
export type ValidatorRuleConstructor<T> = new() => T;

export type TargetMap = Map<string, any>;

export type RuleFn<V = any> = (value: V, targetMap: TargetMap) => boolean;

export type GroupRule = Array<Array<Array<[string, any[]] | [string]>>> | RuleFn[];
