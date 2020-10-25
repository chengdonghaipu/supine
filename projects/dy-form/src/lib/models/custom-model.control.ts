import {BaseModel} from './base.model';
import {ModelPartial} from '../type';

export class CustomModelControl<M = any> extends BaseModel<M> {

  type = 'CUSTOM';

  constructor(init?: ModelPartial<CustomModelControl> & {[key: string]: any}) {
    super();
    this.init(init);
  }
}
