import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { PrizeInfo} from './service/prizeInfo';

import { AppComponent } from './app.component';
import { OnsenModule, CUSTOM_ELEMENTS_SCHEMA } from 'ngx-onsenui';
import { StartComponent } from './start/start.component';
import { WinnerComponent } from './winner/winner.component';
import { ListComponent } from './list/list.component';
import { LottoComponent } from './lotto/lotto.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    WinnerComponent,
    ListComponent,
    LottoComponent
  ],
  imports: [
    BrowserModule,
    OnsenModule,
    HttpClientModule
  ],
  providers: [PrizeInfo],
  bootstrap: [AppComponent],
  entryComponents: [ListComponent, LottoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
