import 'reflect-metadata';
import {DY_FORM_OPTIONS} from './form-metadata';
import {BaseModel} from '../models';


export function BaseDecorator(model: BaseModel): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const options = Reflect.getMetadata(DY_FORM_OPTIONS, target) || [];
    model.name = propertyKey as string;

    options.push(model);
    Reflect.defineMetadata(DY_FORM_OPTIONS, options, target);
  };
}
