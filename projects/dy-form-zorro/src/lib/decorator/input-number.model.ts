import {InputNumberControl as Model} from '../model/input-number.control';
import {merge} from 'lodash';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputNumberModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
