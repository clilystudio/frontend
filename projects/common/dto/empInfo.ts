import { Const } from '../const';

/**
 * 员工信息
 */
export class EmpInfo {

  // 选中状态
  selected = false;

  // 员工ID
  empId = '';

  // 抽奖组ID
  groupId = '';

  // 员工姓名
  empName = '';

  // 员工性别
  empSex = Const.SexFlag.FEMALE;

  // 入职日期
  empDate = '';

  // 部门ID
  deptId = '';

  // 中奖权值
  empRate = 1;

  // 中奖标识
  prizeFlag = Const.PrizeFlag.NONE;

  // 部门名称
  deptName = '';

  // 科室ID
  branchId = '';

  // 排序
  order = 0;
}
