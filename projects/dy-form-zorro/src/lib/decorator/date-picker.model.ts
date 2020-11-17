import {BaseDecorator, ModelPartial} from '@supine/dy-form';
import {DatePickerControl as Model} from '../model/date-picker.control';

export function DatePickerModel<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}
