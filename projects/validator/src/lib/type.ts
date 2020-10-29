
export type validatorRuleConstructor<T> = new() => T;

export type TargetMap = Map<string, any>;

export type RuleFn<V = any> = (value: V, targetMap: TargetMap) => boolean;

