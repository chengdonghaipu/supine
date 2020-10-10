import {merge} from 'lodash';
import {InputGroupModelControl as Model} from '../model/input-group-model.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputGroupModel(model?: ModelPartial<Model>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT_GROUP' }).type = 'INPUT_GROUP';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
