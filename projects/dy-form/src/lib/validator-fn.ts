import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DyFormModule} from './dy-form.module';
import {DY_FORM_VALIDATOR} from './injection-token';
import {ZlValidator, RuleType, ValidatorRuleConstructor} from '@supine/validator';

export function universal_valid(
  controlName: string,
  rules: RuleType,
  msg?: { [key: string]: any },
  property?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validateCtor = DyFormModule.Injector.get(DY_FORM_VALIDATOR, ZlValidator) as ValidatorRuleConstructor<ZlValidator>;

    const validate = new validateCtor();

    const path = property || controlName;
    const data = Object.assign({}, control.root.value, {[path]: control.value});

    if (typeof msg === 'object') {
      // tslint:disable-next-line:forin
      for (const msgKey in msg) {
        msg[`${path}.${msgKey}`] = msg[msgKey];
      }
    }

    validate.clearMessage();

    validate
      .setMessage(msg)
      .setTarget(data)
      .setRule({[path]: rules})
      .make();

    if (validate.fails()) {
      const message = validate.getMessage();
      return {[controlName]: message[path][0]};
    } else {
      return null;
    }
  };
}
