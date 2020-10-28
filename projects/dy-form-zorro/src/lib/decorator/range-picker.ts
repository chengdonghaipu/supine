import {RangePickerControl as Model} from '../model/range-picker.control';
import {BaseDecorator, ModelPartial} from '@supine/dy-form';

export function RangePicker<M>(model?: ModelPartial<Model<M>>): PropertyDecorator {
  const newModel = new Model();
  if (model) {
    Object.assign(newModel, model);
  }
  return BaseDecorator(newModel);
}
