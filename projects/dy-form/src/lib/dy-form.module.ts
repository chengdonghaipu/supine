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
  DyFormControlItemDef,
  DyFormControlItemOutlet,
  DyFormHeader,
  DyFormFooter,
  DyFormArea
} from './dy-form.def';
import {CommonModule} from '@angular/common';

const export_com = [
  DyFormAreaDef,
  DyFormColumnDef,
  DyFormLabelCellDef,
  DyFormControlCellDef,
  DyFormComponent,
  DyFormControlItem,
  DyFormControlItemDef,
  DyFormHeader,
  DyFormFooter,
  DyFormArea
];

@NgModule({
  declarations: [
    DyFormAreaOutlet,
    DyFormCellOutlet,
    DyFormControlItemOutlet,
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
