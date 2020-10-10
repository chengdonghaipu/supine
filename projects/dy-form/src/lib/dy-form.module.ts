import { NgModule } from '@angular/core';
import { DyFormComponent } from './dy-form.component';
import {
  DyFormAreaOutlet,
  DyFormAreaDef,
  DyFormCellOutlet,
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormControlItem,
  DyFormItemDef,
  DyFormControlItemOutlet,
  DyFormHeader,
  DyFormFooter,
  DyFormArea, DyFormTestItemDef
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
  DyFormHeader,
  DyFormFooter,
  DyFormArea,
  DyFormControlItemOutlet,
  DyFormTestItemDef
];

@NgModule({
  declarations: [
    DyFormAreaOutlet,
    DyFormCellOutlet,
    ...export_com
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...export_com
  ]
})
export class DyFormModule { }
