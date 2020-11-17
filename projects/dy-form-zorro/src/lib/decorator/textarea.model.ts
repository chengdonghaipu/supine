import {merge} from 'lodash';
import {TextareaControl as Model} from '../model/textarea.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function TextareaModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'TEXTAREA' }).type = 'TEXTAREA';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
