import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { OnsenModule, CUSTOM_ELEMENTS_SCHEMA } from 'ngx-onsenui';
import { StartComponent } from './start/start.component';
import { WinnerComponent } from './winner/winner.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    WinnerComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    OnsenModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
