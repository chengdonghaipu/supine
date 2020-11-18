export function Const(value): PropertyDecorator {
  return (target, propertyKey) => {
    Object.defineProperty(target, propertyKey, {
      get(): any {
        return value;
      },
    });
  };
}
