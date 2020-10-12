import {GroupModelControl as Model} from '../models/group-model.control';
import {BaseDecorator} from './base.decorator';
import {merge} from 'lodash';
import {ModelPartial} from '../type';

export function GroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'GROUP' }).type = 'GROUP';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
