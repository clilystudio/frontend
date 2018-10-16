import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment'

import { UploadService} from '../service/upload.service';
import { HttpErrorHandler, HandleError } from '../service/http-error-handler.service';
import { EmpInfo } from './empInfo';
import { ApiResult } from '../service/result';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  uploadUrl = 'emp/upload';
  listUrl = 'emp/list';
  deleteUrl = 'emp/delete';

  private handleError: HandleError;

  constructor(private http: HttpClient, private uploadService: UploadService, private httpErrorHandler: HttpErrorHandler) { 
    this.handleError = this.httpErrorHandler.createHandleError('EmpService');
  }

  public upload(file: File): Observable<ApiResult> {
    return this.uploadService.upload(file, this.uploadUrl);
  }

  public list(): Observable<EmpInfo[]> {
    const url = environment.api + this.listUrl;
    return this.http.get<EmpInfo[]>(url).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  public delete(empIds: string[]): Observable<ApiResult> {
    const url = environment.api + this.deleteUrl;
    const progress = new Subject<ApiResult>();
    this.http.post<ApiResult>(url, empIds).subscribe(response => {
      progress.next(response);
    });
    return progress.asObservable();
  }
}
