import { Const } from '../const';

/**
 * 抽选控制信息
 */
export class ControlInfo {

  // 奖项ID
  prizeId = '';

  // 奖项状态
  prizeStatus = Const.PrizeStatus.READYING;

  // 抽取人数
  prizePerson = 1;

  // 控制命令
  command = Const.LottoControl.READY;
}
