import {BaseModel} from './base.model';
import {ModelPartial} from '../type';
import {GroupModelControl} from './group-model.control';

export class LayoutGroupModelControl<M = any> extends GroupModelControl<M> {
  group = true;

  constructor(init?: ModelPartial<GroupModelControl>) {
    super();
    this.init(init);
  }
}
