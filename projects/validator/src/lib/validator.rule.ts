import {TypeMessage} from './type-message';
import {Rule} from './rule';


export class ValidatorRule {

  @TypeMessage()
  typeMessage = {
    in: ':attribute 必须在 :values 范围内'
  };

  @Rule()
  in(value: any, params: string[]) {
    console.log(value, params);
  }
}
