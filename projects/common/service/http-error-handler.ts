import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/** HttpErrorHandler.createHandleError返回的函数类型 */
export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/**
 * HttpClient错误处理
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {

  /** 根据服务名称创建handleError函数 */
  createHandleError = (serviceName = '') =>
    <T>(operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result)

  /**
   * 返回处理http错误的函数，处理http中的异常，保证程序向下执行
   * @param serviceName 服务名称
   * @param operation 操作名称
   * @param result 返回结果
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      const message = (error.error instanceof ErrorEvent) ?
        error.error.message : `${serviceName}: ${operation} 异常 状态码：${error.status} 消息："${error.error}"`;
      console.error(message);
      return of(result);
    };
  }
}
