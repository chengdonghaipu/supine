import {BaseDecorator, ModelPartial} from '@supine/dy-form';
import {TimePickerControl as Model} from '../model/time-picker.control';

export function TimePickerModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}
