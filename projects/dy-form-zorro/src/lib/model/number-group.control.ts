import {ModelPartial} from '@supine/dy-form';
import {InputNumberControl} from './input-number.control';
import {GroupModel} from './group.model';
import {TemplateRef} from '@angular/core';

export class InputNumberGroupControl<M = any> extends InputNumberControl<M> implements GroupModel {
  private _type;

  /**
   * type 必须要实现 不同的type代表不同的控件
   */
  get type() {
    return 'INPUT_NUMBER_GROUP';
  }

  set type(value) {
    this._type = value;
  }

  constructor(init?: ModelPartial<InputNumberControl>) {
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
