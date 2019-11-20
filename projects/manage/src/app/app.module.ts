import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EmpComponent } from './component/emp/emp.component';
import { PrizeComponent } from './component/prize/prize.component';
import { WinnerComponent } from './component/winner/winner.component';

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
