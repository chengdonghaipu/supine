import {InputNumberModelControl as Model} from '../model/input-number-model.control';
import {merge} from 'lodash';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputNumberModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'INPUT_NUMBER' }).type = 'INPUT_NUMBER';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
