import {InputNumberGroupModelControl as Model} from '../model/number-group-model.control';
import {merge} from 'lodash';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputNumberGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT_NUMBER_GROUP' }).type = 'INPUT_NUMBER_GROUP';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
