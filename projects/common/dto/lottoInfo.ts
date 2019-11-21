import { EmpInfo } from './empInfo';

/**
 * 抽奖信息
 */
export class LottoInfo {

  // 奖项ID
  prizeId = '';

  // 抽奖组ID
  groupId = '';

  // 员工ID
  empList: EmpInfo[] = [];
}
