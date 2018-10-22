import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment'

import { HttpErrorHandler, HandleError } from '../service/http-error-handler.service';
import { PrizeInfo } from './prizeInfo';
import { ApiResult } from '../service/result';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LottoService {
  listUrl = 'prize/list';
  editUrl = 'prize/edit';

  private handleError: HandleError;

  constructor(private http: HttpClient, private httpErrorHandler: HttpErrorHandler) { 
    this.handleError = this.httpErrorHandler.createHandleError('PrizeService');
  }

  public list(): Observable<PrizeInfo[]> {
    const url = environment.api + this.listUrl;
    return this.http.get<PrizeInfo[]>(url).pipe(
      catchError(this.handleError('listPrizes', []))
    );
  }

  public edit(prizeInfo: PrizeInfo): Observable<ApiResult> {
    const url = environment.api + this.editUrl;
    return this.http.post<ApiResult>(url, prizeInfo, httpOptions).pipe(
      catchError(this.handleError<ApiResult>('editPrize'))
    );
  }
}
