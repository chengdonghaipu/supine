import 'reflect-metadata';

export function RuleF() {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, key: string, descriptor: PropertyDescriptor | undefined) {
    /*const _error = `完整参数列表为   value: any, rule?: string[], dataMap?: Map<string, any>`,
      paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', target, key);

    let _isError = false;
    if (paramsTypes.length < 1) {
      console.error(`${key} 规则方法的参数最少为一个 ${_error}`);
      _isError = true;
    } else if (paramsTypes.length === 2 && paramsTypes[1].name !== 'Array') {
      console.error(`${key} 规则方法的参数类型错误  ${_error}`);
      _isError = true;
    } else if (paramsTypes.length === 3 && paramsTypes[2].name !== 'Map') {
      console.error(`${key} 规则方法的参数类型错误  ${_error}`);
      _isError = true;
    } else if (paramsTypes.length > 3) {
      console.error(`${key} 规则方法的参数数量最多三个 ${_error} 多余的参数将被视为无效参数`);
      _isError = true;
    }

    const returnType: Function = Reflect.getMetadata('design:returntype', target, key);

    if (!returnType || (returnType.name !== 'String' && returnType.name !== 'Boolean')) {
      console.error(`${key} 规则方法的返回值类型  要么是Boolean 要么是 String (需要显示声明返回值类型)`);
      _isError = true;
    }

    if (_isError) {
      return undefined;
    }*/
    if (!target.__validatorFn) {
      target.__validatorFn = {};
    }
    target.__validatorFn[key] = descriptor.value;
  };
}
