import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DyFormModule} from '@supine/dy-form';
import {DyFormZorroModule} from '@supine/dy-form-zorro';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DyFormModule,
    ReactiveFormsModule,
    DyFormZorroModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
