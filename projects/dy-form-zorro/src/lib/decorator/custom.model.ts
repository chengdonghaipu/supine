import {CustomModelControl as Model} from '../model/custom-model.control';
import {merge} from 'lodash';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function CustomModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'CUSTOM' }).type = 'CUSTOM';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
