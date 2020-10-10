import {merge} from 'lodash';
import {TextareaModelControl as Model} from '../model/textarea-model.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function TextareaModel(model?: ModelPartial<Model>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    (model as { type: 'TEXTAREA' }).type = 'TEXTAREA';
    merge(newModel, model);
  }
  return BaseDecorator(newModel);
}
