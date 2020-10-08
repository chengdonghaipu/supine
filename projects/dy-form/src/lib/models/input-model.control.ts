import {BaseModel} from './base.model';
import {ModelPartial} from '../type';

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
