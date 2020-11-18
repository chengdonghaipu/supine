import {Const, ModelPartial} from '@supine/dy-form';
import {ZorroControlModel} from './zorro-control.model';

type InputType = 'text' | 'password';

export class InputModelControl<M = any> extends ZorroControlModel<M> {
  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  @Const('INPUT')
  type: string;

  /**
   * 只读 如果为true 表示该控件为只读状态
   */
  readonly = false;

  inputType: InputType = 'text';

  constructor(init?: ModelPartial<InputModelControl>) {
    super();
    this.init(init);
  }
}
