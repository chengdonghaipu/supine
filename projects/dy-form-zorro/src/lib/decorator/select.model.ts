import {merge} from 'lodash';
import {SelectControl as Model} from '../model/select.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function SelectModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
