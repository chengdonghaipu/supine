import {BaseFormModel} from '../models';
import 'reflect-metadata';
import {ATTACHED_MODEL} from './form-metadata';
import {Type} from '@angular/core';

export function AttachedModel<T extends BaseFormModel>(metadata?: {models: Type<T>[]}): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ATTACHED_MODEL, metadata?.models || [], target);
  };
}
