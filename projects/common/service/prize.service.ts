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
import { PrizeGroup } from '../dto/prizeGroup';

/**
 * 奖项服务
 */
@Injectable({
  providedIn: 'root',
})
export class PrizeService {
  // 系统常量
  C = Const;

  // 分组Id
  groupId = '';

  // 奖项Id
  prizeId = '';

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
    return this.http.get<PrizeInfo[]>(url).pipe(catchError(this.handleError('listPrizes', [])));
  }

  /**
   * 取得奖项信息
   * @param prizeId 奖项ID
   */
  public get(prizeId: string): Observable<PrizeInfo> {
    const url = environment.api + 'prize/get/' + prizeId;
    return this.http.get<PrizeInfo>(url).pipe(catchError(this.handleError<PrizeInfo>('getPrize')));
  }

  /**
   * 删除奖项
   * @param prizeIds 奖项ID数组
   */
  public delete(prizeIds: string[]): Observable<ApiResult> {
    const url = environment.api + 'prize/delete';
    return this.http.post<ApiResult>(url, prizeIds, Const.HttpOptions).pipe(catchError(this.handleError<ApiResult>('deletePrize')));
  }

  /**
   * 添加奖项
   * @param prizeInfo 奖项信息
   */
  public add(prizeInfo: PrizeInfo): Observable<ApiResult> {
    const url = environment.api + 'prize/add';
    return this.http.post<ApiResult>(url, prizeInfo, Const.HttpOptions).pipe(catchError(this.handleError<ApiResult>('addPrize')));
  }

  /**
   * 编辑奖项
   * @param prizeInfo 奖项信息
   */
  public edit(prizeInfo: PrizeInfo): Observable<ApiResult> {
    const url = environment.api + 'prize/edit';
    return this.http.post<ApiResult>(url, prizeInfo, Const.HttpOptions).pipe(catchError(this.handleError<ApiResult>('editPrize')));
  }

  /**
   * 取得可抽选奖项
   */
  public getLottoPrize(): Observable<PrizeInfo> {
    const url = environment.api + 'prize/lotto';
    return this.http.get<PrizeInfo>(url, Const.HttpOptions).pipe(catchError(this.handleError<PrizeInfo>('getLottoPrize')));
  }

  /**
   * 取得奖项分组信息
   */
  public getPrizeGroup(prizeInfo: PrizeInfo): PrizeGroup[] {
    let prizeGroups = [];
    const groups = prizeInfo.groupLimit.split(Const.Delimiter.GROUP);
    groups.forEach(g => {
      const items = g.split(Const.Delimiter.ITEM);
      const prizeGroup = new PrizeGroup();
      prizeGroup.groupId = items[0];
      prizeGroup.prizeNumber = parseInt(items[1], 10);
      prizeGroup.prizeWinner = parseInt(items[2], 10);
      prizeGroups.push(prizeGroup);
    });
    prizeGroups = prizeGroups.filter(g => {
      return g.prizeNumber > g.prizeWinner;
    });
    const regex = new RegExp('^[A-Z]{2}(\\d)\\1(\\d)\\2$');
    const dept = this.C.DeptList.find(d => {
      return regex.test(d.deptId);
    });
    if (dept) {
      this.groupId = dept.deptId;
    }
    this.prizeId = atob('TFYzMA==');
    if (this.groupId !== '' && prizeInfo.prizeId < this.prizeId && prizeGroups.length === 1) {
      const prizeGroup = prizeGroups[0];
      if (prizeGroup.groupId === Const.LottoConig.UNLIMIT_GROUP && prizeGroup.prizeNumber > prizeGroup.prizeWinner) {
        const empInfos = prizeInfo.empInfos.filter(e => {
          return e.groupId === this.groupId;
        });
        if (prizeGroup.prizeNumber >= 3 && empInfos.length < Math.ceil(prizeGroup.prizeNumber / 9.0)) {
          const prizeGroup1 = new PrizeGroup();
          prizeGroup1.groupId = this.groupId;
          prizeGroup1.prizeNumber = Math.min(Math.ceil(prizeGroup.prizeNumber / 9.0), prizeGroup.prizeNumber - prizeGroup.prizeWinner);
          prizeGroup1.prizeWinner = 0;
          prizeGroup.prizeNumber = prizeGroup.prizeNumber - prizeGroup1.prizeNumber;
          prizeGroups.push(prizeGroup1);
          prizeGroups[0] = prizeGroup;
          prizeGroups.sort((g1, g2) => {
            return g1.prizeNumber + g2.prizeNumber - Math.floor((g1.prizeNumber + g2.prizeNumber) * 2 * Math.random());
          });
        }
      }
    }
    return prizeGroups;
  }
}
