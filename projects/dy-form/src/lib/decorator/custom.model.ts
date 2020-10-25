import {CustomModelControl as Model} from '../models/custom-model.control';
import {merge} from 'lodash';
import {BaseDecorator} from './base.decorator';
import {ModelPartial} from '../type';

export function CustomModel<M>(model?: ModelPartial<Model<M>> & { [key: string]: any }): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
