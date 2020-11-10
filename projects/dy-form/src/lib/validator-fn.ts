import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DyFormModule} from './dy-form.module';
import {DY_FORM_VALIDATOR} from './injection-token';
import {ZlValidator, RuleType} from '@supine/validator';

export function universal_valid(controlName: string, rules: RuleType, msg?: { [key: string]: any } | string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validate = DyFormModule.Injector.get(DY_FORM_VALIDATOR, new ZlValidator()) as ZlValidator;
    const data = {};

    /*const path = [controlName];
    let rootControl = control;

    while (true) {
      if (control.parent) {
        // (control as FormControl)
        rootControl = control.parent;
        path.push(control.parent)
      }
    }*/

    if (control.parent) {
      Object.assign(data, control.root.value, {[controlName]: control.value});
    }

    if (typeof msg === 'string') {
      msg = {[controlName]: msg};
    }

    if (typeof msg === 'object') {
      // tslint:disable-next-line:forin
      for (const msgKey in msg) {
        msg[`${controlName}.${msgKey}`] = msg[msgKey];
      }
    }

    validate
      .setMessage(msg)
      .setTarget(data)
      .setRule({[controlName]: rules})
      .make();

    if (validate.fails()) {
      const message = validate.getMessage();

      return {[controlName]: message[controlName][0]};
    } else {
      return null;
    }
  };
}
