import {DyFormRef, BaseFormModel, DyFormRefInitialData} from '@supine/dy-form';
import {Type} from '@angular/core';

export type DyFormMode = 'vertical' | 'horizontal' | 'inline' | 'custom';

interface InitialData extends DyFormRefInitialData {
  mode?: DyFormMode;

  verticalLayout?: {
    labelCol: number,
    controlCol: number,
  };
}


export class ZorroDyFormRef<T extends BaseFormModel> extends DyFormRef<T> {
  constructor(model: Type<T>, initialData: InitialData = {}) {
    super(model, initialData);
  }
}
