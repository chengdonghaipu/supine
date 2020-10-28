import {InputNumberGroupControl as Model} from '../model/number-group.control';
import {merge} from 'lodash';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function InputNumberGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
