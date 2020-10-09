import {Registered} from './decorator';
import {ValidatorF} from './validator-f';
import {Validator} from './validator';

@Registered({
  declarations: [ValidatorF]
})
export class JdValidator extends Validator {
  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(rules: string);
  // tslint:disable-next-line:unified-signatures
  constructor(rules: string, data: any);
  // constructor(rules: string, data: any, messages: string);
  // constructor(rules: { [key: string]: any });
  // constructor(rules: { [key: string]: any }, data: any);
  // constructor(rules: { [key: string]: any }, data: any, messages: { [key: string]: any });
  constructor(rules?: any, data?: any, messages?: any) {
    super(rules, data, messages);
  }
}
