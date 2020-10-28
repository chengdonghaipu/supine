import {BaseModel} from '@supine/dy-form';

export class ZorroControlModel<M> extends BaseModel<M> {
  readonly type: string;

  // 对应 nzValidatingTip
  validatingTip: string;
  // 对应 nzHasFeedback
  hasFeedback: boolean;
  // 对应 nzExtra
  extra: string;

  constructor() {
    super();
  }


}
