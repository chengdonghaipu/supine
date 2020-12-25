import {DyFormRef, BaseFormModel} from '@supine/dy-form';
import {ChangeDetectorRef, Type} from '@angular/core';

export type DyFormMode = 'vertical' | 'horizontal' | 'inline' | 'custom';

interface InitialData {
  mode?: DyFormMode;

  // verticalLayout?: {
  //   labelCol: number,
  //   controlCol: number,
  // };
}


export class ZorroDyFormRef<T extends BaseFormModel> extends DyFormRef<T> {
  mode: DyFormMode = 'vertical';

  changeDetectorRef: ChangeDetectorRef;

  constructor(model: Type<T>, initialData: InitialData = {}) {
    super(model);
    for (const initialDataKey in initialData) {
      if (initialData.hasOwnProperty(initialDataKey)) {
        this[initialDataKey] = initialData[initialDataKey];
      }
    }
  }

  setLayout(layout: DyFormMode): void {
    if (!this.dyForm) {
      throw Error(`初始化后才能执行 setLayout`);
    }

    this.mode = layout;

    this.changeDetectorRef.markForCheck();

    setTimeout(() => this.dyForm.forceRenderLayout());
  }
}
