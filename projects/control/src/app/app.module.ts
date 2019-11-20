import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { OnsenModule, CUSTOM_ELEMENTS_SCHEMA } from 'ngx-onsenui';
import { LottoComponent } from './component/lotto/lotto.component';
import { WinnerComponent } from './component/winner/winner.component';

@NgModule({
  declarations: [
    AppComponent,
    LottoComponent,
    WinnerComponent
  ],
  imports: [
    OnsenModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LottoComponent, WinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
