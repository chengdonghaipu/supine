// import {InputModelControl as Model} from '../models/input-model.control';
import {InputModelControl as Model} from '../model/input-model.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT' }).type = 'INPUT';
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}
