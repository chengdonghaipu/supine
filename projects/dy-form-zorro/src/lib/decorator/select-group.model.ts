import {merge} from 'lodash';
import {SelectGroupControl as Model} from '../model/select-group.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function SelectGroupModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
