import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {Provider} from '@angular/core';
import {DyFormZorroModule} from '@supine/dy-form-zorro';

export const moduleList = [
  DyFormZorroModule,
  NzFormModule,
  NzInputModule,
  NzSelectModule,
  NzButtonModule,
  NzCheckboxModule
];

export const providers: Provider[] = [
];
