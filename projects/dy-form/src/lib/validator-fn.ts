import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {JdValidator} from './validator/jd-validator';

export function universal_valid(controlName: string, rules: string, msg?: { [key: string]: any } | string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validate = new JdValidator();
    const data = {};

    if (control.parent) {
      Object.assign(data, control.parent.value, { [controlName]: control.value });
    }

    if (typeof msg === 'string') {
      msg = { [controlName]: msg };
    }

    if (typeof msg === 'object') {
      // tslint:disable-next-line:forin
      for (const msgKey in msg) {
        msg[`${controlName}.${msgKey}`] = msg[msgKey];
      }
    }
    return validate.make({ [controlName]: rules }, data, msg).getNgMsg(controlName);
  };
}
