import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DY_FORM_VALIDATOR, DyFormModule} from '@supine/dy-form';
import {DyFormZorroModule} from '@supine/dy-form-zorro';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {ZlValidator} from '@supine/validator';
import zh from '@angular/common/locales/zh';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DyFormModule,
    ReactiveFormsModule,
    DyFormZorroModule,
    BrowserAnimationsModule,
    NzGridModule,
    NzCheckboxModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    FormsModule
  ],
  providers: [
    {provide: DY_FORM_VALIDATOR, useValue: ZlValidator},
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
