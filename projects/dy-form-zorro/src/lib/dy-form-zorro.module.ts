import { NgModule } from '@angular/core';
import { DyFormZorroComponent } from './dy-form-zorro.component';
import {DyFormModule} from '@supine/dy-form';
import {ReactiveFormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {CommonModule} from '@angular/common';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzTimePickerModule} from 'ng-zorro-antd/time-picker';



@NgModule({
  declarations: [DyFormZorroComponent],
  imports: [
    DyFormModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    CommonModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule
  ],
  exports: [DyFormZorroComponent]
})
export class DyFormZorroModule { }
