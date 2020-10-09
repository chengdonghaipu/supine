import {Validator, ValidatorFnConstructor} from '../validator';
import {isPlainObject, merge} from 'lodash';

export interface CdValidRegisteredOptions {
  declarations?: ValidatorFnConstructor[];
}

export function Registered(options?: CdValidRegisteredOptions) {
  const _default: CdValidRegisteredOptions = {
    declarations: []
  };

  if (options && isPlainObject(options)) {
    merge(_default, options);
  }

  Validator.registered(_default.declarations);

  return function(target: Function): any {
    // injectable(target);
    if (target.prototype.__validatorFn) {
      Validator.registered([<any>target]);
    }
  };
}
