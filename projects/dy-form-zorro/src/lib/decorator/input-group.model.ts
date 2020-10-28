import {merge} from 'lodash';
import {InputGroupControl as Model} from '../model/input-group.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT_GROUP' }).type = 'INPUT_GROUP';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
