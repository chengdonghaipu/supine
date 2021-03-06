import {LayoutGroupModelControl as Model} from '../models/layout-group-model.control';
import {BaseDecorator} from './base.decorator';
import {merge} from 'lodash';
import {ModelPartial} from '../type';

export function LayoutGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    model.groupMode = 'combine';
    (model as { layoutGroup: boolean }).layoutGroup = true;
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
