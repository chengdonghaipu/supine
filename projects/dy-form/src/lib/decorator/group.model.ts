import {GroupModelControl as Model} from '../models/group-model.control';
import {BaseDecorator} from './base.decorator';
import {merge} from 'lodash';
import {ModelPartial} from '../type';

export function GroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { group: boolean }).group = true;
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
