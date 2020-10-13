import {merge} from 'lodash';
import {SelectGroupModelControl as Model} from '../model/select-group-model.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function SelectGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'SELECT_GROUP' }).type = 'SELECT_GROUP';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
