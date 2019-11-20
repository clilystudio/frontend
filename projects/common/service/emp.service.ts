import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Const } from '../const';
import { environment } from '../environments/environment';
import { EmpInfo } from '../dto/empInfo';
import { ApiResult } from '../dto/api-result';
import { HttpErrorHandler, HandleError } from './http-error-handler';
import { UploadService } from '../service/upload.service';

/**
 * 员工服务
 */
@Injectable({
  providedIn: 'root'
})
export class EmpService {

  // 异常处理
  private handleError: HandleError;

  constructor(private http: HttpClient, private uploadService: UploadService, private httpErrorHandler: HttpErrorHandler) {
    this.handleError = this.httpErrorHandler.createHandleError('EmpService');
  }

  /**
   * 批量导入
   * @param file 数据文件
   */
  public upload(file: File): Observable<ApiResult> {
    return this.uploadService.upload(file, 'emp/upload');
  }

  /**
   * 取得员工一览
   */
  public list(): Observable<EmpInfo[]> {
    const url = environment.api + 'emp/list';
    return this.http.get<EmpInfo[]>(url).pipe(
      catchError(this.handleError('listEmps', []))
    );
  }

  /**
   * 删除员工
   * @param empIds 员工ID数组
   */
  public delete(empIds: string[]): Observable<ApiResult> {
    const url = environment.api + 'emp/delete';
    return this.http.post<ApiResult>(url, empIds, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('deleteEmp'))
    );
  }

  /**
   * 添加员工
   * @param empinfo 员工信息
   */
  public add(empinfo: EmpInfo): Observable<ApiResult> {
    const url = environment.api + 'emp/add';
    return this.http.post<ApiResult>(url, empinfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('addEmp'))
    );
  }

  /**
   * 编辑员工
   * @param empinfo 员工信息
   */
  public edit(empinfo: EmpInfo): Observable<ApiResult> {
    const url = environment.api + 'emp/edit';
    return this.http.post<ApiResult>(url, empinfo, Const.HttpOptions).pipe(
      catchError(this.handleError<ApiResult>('editEmp'))
    );
  }
}
