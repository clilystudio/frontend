import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Http} from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { EmpComponent } from './emp/emp.component';
import { PrizeComponent } from './prize/prize.component';
import { WinnerComponent } from './winner/winner.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpComponent,
    PrizeComponent,
    WinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
