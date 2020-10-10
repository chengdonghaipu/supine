import {BaseModel, ModelPartial} from '@supine/dy-form';

export class InputModelControl<M = any> extends BaseModel<M> {

  type = 'INPUT';

  /**
   * 只读
   */
  readonly = false;

  constructor(init?: ModelPartial<InputModelControl>) {
    super();
    this.init(init);
  }
}
