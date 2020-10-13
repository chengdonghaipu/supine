import {TemplateRef} from '@angular/core';
import {SelectModelControl} from './select-model.control';
import {GroupModel} from './group.model';

export interface SelectOptionContent {
  value: any;
  label?: string;
  disabled?: boolean;
}

export class SelectGroupModelControl<M = any> extends SelectModelControl<M> implements GroupModel {
  type = 'SELECT_GROUP';

  suffixIconPv: TemplateRef<void>;

  addOnAfter: string | TemplateRef<void>;
  addOnAfterIcon: string | null;
  addOnBefore: string | TemplateRef<void>;
  addOnBeforeIcon: string | null;
  prefix: string | TemplateRef<void>;
  prefixIcon: string | null;
  suffix: string | TemplateRef<void>;
  suffixIcon: string | null;

  ngModelChange: ($event) => void = $event => {};

  openChange: (open: boolean) => void = open => {};

  constructor(init?: SelectModelControl) {
    super();
    this.init(init);
  }

}
