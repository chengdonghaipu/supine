export function Const(value): PropertyDecorator {
  return (target, propertyKey) => {
    Object.defineProperty(target, propertyKey, {
      writable: true,
      get(): any {
        return value;
      }
    });
  };
}
