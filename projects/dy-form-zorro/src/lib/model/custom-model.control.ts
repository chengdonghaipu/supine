import {BaseModel, ModelPartial} from '@supine/dy-form';

export class CustomModelControl<M = any> extends BaseModel<M> {

  type = 'CUSTOM';

  /**
   * 只读
   */
  readonly = false;

  constructor(init?: ModelPartial<CustomModelControl>) {
    super();
    this.init(init);
  }
}
