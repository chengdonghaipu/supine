import {InputModelControl} from './input-model.control';
import {GroupModel} from './group.model';
import {TemplateRef} from '@angular/core';
import {Const} from '@supine/dy-form';

export class InputGroupControl<M> extends InputModelControl<M> implements GroupModel {
  @Const('INPUT_GROUP')
  type: string;

  /**
   * 是否用搜索框
   */
  search = false;

  constructor(init?: InputModelControl) {
    super(init as unknown as InputModelControl);
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
