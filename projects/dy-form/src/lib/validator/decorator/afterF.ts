import 'reflect-metadata';

export function AfterF() {
  return function(target: any, key: string, descriptor: PropertyDescriptor | undefined) {
    const _error = `参数列表为   that: this`,
      paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', target, key);

    if (paramsTypes.length < 1) {
      console.error(`${key} 规则方法的参数数量为1个 如果不使用 将会丧失很多能力 ${_error}`);
    } else if (paramsTypes.length > 1) {
      console.error(`${key} 规则方法的参数数量为1个 ${_error} 多余的参数将被视为无效参数`);
    }
    if (!target.__afterF) {
      target.__afterF = {};
    }
    target.__afterF[key] = descriptor.value;
  };
}
