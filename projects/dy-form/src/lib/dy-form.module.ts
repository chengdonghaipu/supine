import {Injector, NgModule} from '@angular/core';
import {DyFormComponent} from './dy-form.component';
import {
  DyFormCellOutlet,
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormFooterDef,
  DyFormFooterOutlet,
  DyFormHeaderOutlet,
  DyFormHeaderDef,
} from './dy-form.def';
import {CommonModule} from '@angular/common';
import {
  DyLayoutComponent,
  DyLayoutDirective,
  DyLayoutItemDirective,
  DyFormLayoutOutlet
} from './dy-layout';

const export_com = [
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormComponent,
  DyFormHeaderDef,
  DyFormFooterDef,
  DyLayoutComponent,
  DyLayoutItemDirective,
  DyLayoutDirective
];

@NgModule({
  declarations: [
    DyFormCellOutlet,
    DyFormFooterOutlet,
    DyFormHeaderOutlet,
    DyFormLayoutOutlet,
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
