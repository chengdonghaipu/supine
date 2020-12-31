import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';
import { moduleList, providers } from './module';

{{imports}}

@NgModule({
  imports     : [
    ShareModule,
    ...moduleList,
    RouterModule.forChild([
      // { path: 'en', component: NzDemo{{component}}EnComponent },
      { path: 'zh', component: NzDemo{{component}}ZhComponent },
      { path: 'en', redirectTo: 'zh' },
    ])
  ],
  declarations: [
{{declarations}}
  ],
entryComponents: [
  {{entryComponents}}
],
providers: [
  ...providers
]
})
export class NzDemo{{component}}Module {

}
