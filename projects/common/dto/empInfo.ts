import { Const } from '../const';

/**
 * 员工信息
 */
export class EmpInfo {

  // 选中状态
  selected = false;

  // 员工ID
  empId = '';

  // 员工姓名
  empName = '';

  // 员工性别
  empSex = '';

  // 部门ID
  deptId = '';

  // 部门名称
  deptName = '';

  // 科室ID
  branchId = '';

  // 中奖权值
  empRate = 1;

  // 中奖标识
  prizeFlag = Const.PrizeFlag.NONE;

  // 排序
  order = 0;
}
