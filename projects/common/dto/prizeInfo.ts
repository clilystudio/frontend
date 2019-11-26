import { Const } from '../const';
import { PrizeGroup } from './prizeGroup';

/**
 * 奖项信息
 */
export class PrizeInfo {

  // 选中状态
  selected = false;

  // 奖项ID
  prizeId = 'CS8';

  // 奖项类型
  prizeType = Const.PrizeType.CASH;

  // 奖项名称
  prizeName = '现金奖';

  // 奖项描述
  prizeDesc = '人民币';

  // 抽奖顺序
  prizeOrder = 3000;

  // 抽奖组限定
  groupLimit = Const.UNLIMIT_GROUP + ',0,0';

  // 奖品数量
  prizeNumber = 1;

  // 中奖人数
  prizeWinner = 0;

  // 允许重复中奖
  prizeMulti = Const.PrizeMulti.NO;

  // 奖项状态
  prizeStatus = Const.PrizeStatus.READYING;

  // 奖项分组信息
  prizeGroups: PrizeGroup[];
}
