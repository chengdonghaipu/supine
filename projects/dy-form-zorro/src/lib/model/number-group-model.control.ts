import {ModelPartial} from '@supine/dy-form';
import {InputNumberModelControl} from './input-number-model.control';
import {GroupModel} from './group.model';
import {TemplateRef} from '@angular/core';

export class InputNumberGroupModelControl<M = any> extends InputNumberModelControl<M> implements GroupModel {

  type = 'INPUT_NUMBER_GROUP';

  constructor(init?: ModelPartial<InputNumberModelControl>) {
    super();
    this.init(init);
  }

  addOnAfter: string | TemplateRef<void>;
  addOnAfterIcon: string | null;
  addOnBefore: string | TemplateRef<void>;
  addOnBeforeIcon: string | null;
  prefix: string | TemplateRef<void>;
  prefixIcon: string | null;
  suffix: string | TemplateRef<void>;
  suffixIcon: string | null;
}
