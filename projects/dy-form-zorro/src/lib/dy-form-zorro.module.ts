import { NgModule } from '@angular/core';
import { DyFormZorroComponent } from './dy-form-zorro.component';
import {DyFormModule} from '@supine/dy-form';
import {ReactiveFormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';



@NgModule({
  declarations: [DyFormZorroComponent],
  imports: [
    DyFormModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule
  ],
  exports: [DyFormZorroComponent]
})
export class DyFormZorroModule { }
