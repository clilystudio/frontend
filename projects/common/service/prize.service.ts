import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler';
import { Const } from '../const';
import { environment } from '../environments/environment';
import { PrizeInfo } from '../dto/prizeInfo';
import { ApiResult } from '../dto/api-result';
import { UploadService } from '../service/upload.service';

/**
 * 奖项服务
 */
@Injectable({
  providedIn: 'root'
})
export class PrizeService {

  // 异常处理
  private handleError: HandleError;

  constructor(private http: HttpClient, private uploadService: UploadService, private httpErrorHandler: HttpErrorHandler) {
    this.handleError = this.httpErrorHandler.createHandleError('PrizeService');
  }

  /**
   * 批量导入
   * @param file 奖项数据文件
   */
  public upload(file: File): Observable<ApiResult> {
    return this.uploadService.upload(file, 'prize/upload');
  }

  /**
   * 取得奖项一览
   */
  public list(): Observable<PrizeInfo[]> {
    const url = environment.api + 'prize/list';
    return this.http.get<PrizeInfo[]>(url).pipe(
      catchError(this.handleError('listPrizes', []))
    );
  }

  /**
   * 取得奖项信息
   * @param prizeId 奖项ID
   */
  public get(prizeId: string): Observable<PrizeInfo> {
    const url = environment.api + 'prize/get/' + prizeId;
    return this.http.get<PrizeInfo>(url).pipe(
      catchError(this.handleError<PrizeInfo>('getPrize'))
    );
  }

  /**
   * 删除奖项
   * @param prizeIds 奖项ID数组
   */
  public delete(prizeIds: string[]): Observable<ApiResult> {
    const url = environment.api + 'prize/delete';
    return this.http.post<ApiResult>(url, prizeIds, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('deletePrize'))
    );
  }

  /**
   * 添加奖项
   * @param prizeInfo 奖项信息
   */
  public add(prizeInfo: PrizeInfo): Observable<ApiResult> {
    const url = environment.api + 'prize/add';
    return this.http.post<ApiResult>(url, prizeInfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('addPrize'))
    );
  }

  /**
   * 编辑奖项
   * @param prizeInfo 奖项信息
   */
  public edit(prizeInfo: PrizeInfo): Observable<ApiResult> {
    const url = environment.api + 'prize/edit';
    return this.http.post<ApiResult>(url, prizeInfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('editPrize'))
    );
  }

  /**
   * 取得可抽选奖项
   */
  public getLottoPrize(): Observable<PrizeInfo> {
    const url = environment.api + 'prize/lotto';
    return this.http.get<PrizeInfo>(url, Const.HttpOptions).pipe(
      catchError(this.handleError<PrizeInfo>('getLottoPrize'))
    );
  }
}
