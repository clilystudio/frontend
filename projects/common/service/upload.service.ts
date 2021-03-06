import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResult } from '../dto/api-result';

/**
 * CSV文件导入服务
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  /**
   * 文件导入
   * @param file 数据文件
   * @param apiUrl API地址
   */
  public upload(file: File, apiUrl: string): Observable<ApiResult> {
    const url = environment.api + apiUrl;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('clearAll', 'true');
    const progress = new Subject<ApiResult>();
    this.http.post<ApiResult>(url, formData).subscribe(response => {
      progress.next(response);
    });
    return progress.asObservable();
  }
}
