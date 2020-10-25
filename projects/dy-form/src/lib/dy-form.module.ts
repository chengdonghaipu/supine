import {Injector, NgModule} from '@angular/core';
import {DyFormComponent} from './dy-form.component';
import {
  DyFormAreaOutlet,
  DyFormAreaDef,
  DyFormCellOutlet,
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormControlItem,
  DyFormItemDef,
  DyFormItemOutlet,
  DyFormFooterDef,
  DyFormArea,
  DyFormItemWrapDef,
  DyFormFooterOutlet,
  DyFormHeaderOutlet,
  DyFormHeaderDef
} from './dy-form.def';
import {CommonModule} from '@angular/common';

const export_com = [
  DyFormAreaDef,
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormComponent,
  DyFormControlItem,
  DyFormItemDef,
  DyFormHeaderDef,
  DyFormFooterDef,
  DyFormArea,
  DyFormItemOutlet,
  DyFormItemWrapDef
];

@NgModule({
  declarations: [
    DyFormAreaOutlet,
    DyFormCellOutlet,
    DyFormFooterOutlet,
    DyFormHeaderOutlet,
    ...export_com
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...export_com
  ]
})
export class DyFormModule {
  static Injector: Injector = null;

  constructor(injector: Injector) {
    DyFormModule.Injector = injector;
  }
}
