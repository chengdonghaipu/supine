import {DY_FORM_VALIDATOR, DyFormModule} from '@supine/dy-form';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {Provider} from '@angular/core';
import {ExpandValidator} from './expand-verify';

export const moduleList = [
   DyFormModule,
   NzFormModule,
   NzInputModule,
   NzSelectModule,
   NzButtonModule,
];

export const providers: Provider[] = [
  {provide: DY_FORM_VALIDATOR, useValue: ExpandValidator}
];
