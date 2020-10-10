import {BaseFormModel} from '../models';
import 'reflect-metadata';
import {ATTACHED_MODEL} from './form-metadata';

export function DyFormModel<T extends BaseFormModel>(metadata?: {models: T[]}): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ATTACHED_MODEL, metadata?.models || [], target);
  };
}
