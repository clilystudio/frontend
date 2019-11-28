import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Const } from '../const';
import { environment } from '../environments/environment';
import { SysInfo } from '../dto/sysInfo';
import { ApiResult } from '../dto/api-result';
import { HttpErrorHandler, HandleError } from './http-error-handler';
import { UploadService } from '../service/upload.service';
import { WinnerInfo } from '../dto/winnerInfo';
import { LottoInfo } from '../dto/lottoInfo';

/**
 * 系统配置服务
 */
@Injectable({
  providedIn: 'root'
})
export class SysService {

  // 异常处理
  private handleError: HandleError;

  constructor(private http: HttpClient, private uploadService: UploadService, private httpErrorHandler: HttpErrorHandler) {
    this.handleError = this.httpErrorHandler.createHandleError('SysService');
  }

  /**
   * 取得系统配置信息
   * @param sysKey 系统配置KEY
   */
  public get(sysKey: string): Observable<SysInfo> {
    const url = environment.api + 'sys/get/' + sysKey;
    return this.http.get<SysInfo>(url).pipe(
      catchError(this.handleError<SysInfo>('getSys'))
    );
  }

  /**
   * 保存系统配置信息
   * @param sysInfo 系统配置信息
   */
  public set(sysInfo: SysInfo): Observable<ApiResult> {
    const url = environment.api + 'sys/set';
    return this.http.post<ApiResult>(url, sysInfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('addPrize'))
    );
  }

  /**
   * 获取中奖信息一览
   */
  public getWinner(): Observable<WinnerInfo[]> {
    const url = environment.api + 'sys/winner';
    return this.http.get<WinnerInfo[]>(url, Const.HttpOptions).pipe(
      catchError(this.handleError<WinnerInfo[]>('getWinner'))
    );
  }

  /**
   * 重置系统
   */
  public reset(): Observable<ApiResult> {
    const url = environment.api + 'sys/reset';
    return this.http.post<ApiResult>(url, {}, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('reset'))
    );
  }

  /**
   * 设置抽奖信息
   */
  public setLotto(lottoInfo: LottoInfo): Observable<ApiResult> {
    const url = environment.api + 'sys/setlotto';
    return this.http.post<ApiResult>(url, lottoInfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('setLotto'))
    );
  }

  /**
   * 移除中奖信息
   */
  public removeWinner(winnerInfo: WinnerInfo): Observable<ApiResult> {
    const url = environment.api + 'sys/removewinner';
    return this.http.post<ApiResult>(url, winnerInfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('removeWinner'))
    );
  }

  /**
   * 刷新前台
   */
  public refresh(): Observable<ApiResult> {
    const url = environment.api + 'sys/refresh';
    return this.http.post<ApiResult>(url, [], Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('refresh'))
    );
  }
}
