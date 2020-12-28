import {BaseFormModel} from '../models';
import 'reflect-metadata';
import {CONTROL_MODEL} from './form-metadata';
import {Type} from '@angular/core';

export interface ControlModelMeta<T extends BaseFormModel> {
  models?: Type<T>[];
  updateOn?: 'change' | 'blur' | 'submit';
}

export function ControlModel<T extends BaseFormModel>(metadata?: ControlModelMeta<T>): ClassDecorator {
  return target => {
    const defaultValue = {
      models: metadata?.models || [],
      updateOn: metadata?.updateOn,
    };

    Reflect.defineMetadata(CONTROL_MODEL, defaultValue, target);
  };
}
