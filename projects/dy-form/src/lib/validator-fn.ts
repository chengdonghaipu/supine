import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {JdValidator} from './validator/jd-validator';
import {DyFormModule} from './dy-form.module';
import {DY_FORM_VALIDATOR} from './injection-token';

export function universal_valid(controlName: string, rules: string, msg?: { [key: string]: any } | string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validate = DyFormModule.Injector.get(DY_FORM_VALIDATOR, new JdValidator());
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
