import { Const } from '../const';

/**
 * 奖项信息
 */
export class PrizeInfo {

  // 选中状态
  selected = false;

  // 奖项ID
  prizeId = 'CS8';

  // 奖项名称
  prizeName = '现金奖';

  // 奖项描述
  prizeDesc = '人民币';

  // 抽奖顺序
  prizeOrder = 3000;

  // 奖品数量
  prizeNumber = 1;

  // 中奖人数
  prizeWinner = 0;

  // 部门ID
  deptId = '';

  // 允许重复中奖
  prizeMulti = Const.PrizeMulti.NO;

  // 奖项状态
  prizeStatus = Const.PrizeStatus.READYING;
}
