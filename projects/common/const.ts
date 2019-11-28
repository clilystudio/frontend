import { HttpHeaders } from '@angular/common/http';

/**
 * 常量定义
 */
export const Const = {

  /** HTTP请求选项 */
  HttpOptions: {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  },

  // 部门列表，因为数据固定，直接在前端定义而不通过后台从数据库中取得了
  DeptList: [
    { deptId: 'IC1000', deptName: '第一事业单位', idName: 'IC1000 : 第一事业单位' },
    { deptId: 'FC10C0', deptName: '共享服务中心', idName: 'FC10C0 : 共享服务中心' },
    { deptId: 'FC10C1', deptName: '人资服务课', idName: 'FC10C1 : 人资服务课' },
    { deptId: 'FC10C2', deptName: '行政服务课', idName: 'FC10C2 : 行政服务课' },
    { deptId: 'FC10C3', deptName: '资讯服务课', idName: 'FC10C3 : 资讯服务课' },
    { deptId: 'FF0230', deptName: '大陆资金部', idName: 'FF0230 : 大陆资金部' },
    { deptId: 'IC1001', deptName: '商务中心', idName: 'IC1001 : 商务中心' },
    { deptId: 'IC1010', deptName: '产品全球化交付中心', idName: 'IC1010 : 产品全球化交付中心' },
    { deptId: 'IC1020', deptName: '高科技业务二部', idName: 'IC1020 : 高科技业务二部' },
    { deptId: 'IC1021', deptName: '高科技业务一课', idName: 'IC1021 : 高科技业务一课' },
    { deptId: 'IC1022', deptName: '高科技业务二课', idName: 'IC1022 : 高科技业务二课' },
    { deptId: 'IC1030', deptName: '高科技业务三部', idName: 'IC1030 : 高科技业务三部' },
    { deptId: 'IC1031', deptName: '高科技业务一课', idName: 'IC1031 : 高科技业务一课' },
    { deptId: 'IC1032', deptName: '高科技业务二课', idName: 'IC1032 : 高科技业务二课' },
    { deptId: 'IC1040', deptName: '新业务开发部', idName: 'IC1040 : 新业务开发部' },
    { deptId: 'IC1041', deptName: '高科技业务一课', idName: 'IC1041 : 高科技业务一课' },
    { deptId: 'IC1042', deptName: '高科技业务二课', idName: 'IC1042 : 高科技业务二课' },
    { deptId: 'IC1043', deptName: '互联网业务课', idName: 'IC1043 : 互联网业务课' },
    { deptId: 'IC1050', deptName: '大连交付中心', idName: 'IC1050 : 大连交付中心' },
    { deptId: 'IC1100', deptName: '业务一处', idName: 'IC1100 : 业务一处' },
    { deptId: 'IC1110', deptName: '大连开发中心', idName: 'IC1110 : 大连开发中心' },
    { deptId: 'IC1111', deptName: '开发一课', idName: 'IC1111 : 开发一课' },
    { deptId: 'IC1112', deptName: '开发二课', idName: 'IC1112 : 开发二课' },
    { deptId: 'IC1113', deptName: '技术支持课', idName: 'IC1113 : 技术支持课' },
    { deptId: 'IC1120', deptName: '高科技业务一部', idName: 'IC1120 : 高科技业务一部' },
    { deptId: 'IC1200', deptName: '业务二处', idName: 'IC1200 : 业务二处' },
    { deptId: 'IC1210', deptName: '大连BPO中心', idName: 'IC1210 : 大连BPO中心' },
    { deptId: 'IC1211', deptName: 'BPO交付一课', idName: 'IC1211 : BPO交付一课' },
    { deptId: 'IC1212', deptName: 'BPO交付二课', idName: 'IC1212 : BPO交付二课' },
    { deptId: 'IC1220', deptName: '业务一部', idName: 'IC1220 : 业务一部' },
    { deptId: 'IC1230', deptName: '业务二部', idName: 'IC1230 : 业务二部' },
    { deptId: 'IC1310', deptName: '業務部', idName: 'IC1310 : 業務部' }
  ],

  /** 编辑标识 */
  EditFlag: {
    ADD: 0,
    EDIT: 1,
  },

  /** 员工性别状态 */
  SexFlag: {
    // 男
    MALE: 'M',
    // 女
    FEMALE: 'F',
    // 不祥
    UNKNOWN: 'X',
  },

  /** 员工中奖状态 */
  PrizeFlag: {
    // 未中奖
    NONE: '0',
    // 已中奖
    WIN: '1',
    // 已弃奖
    GIVEUP: '9',
  },

  /** 奖项状态 */
  PrizeStatus: {
    READYING: '1',
    READIED: '2',
    STARTTING: '3',
    STARTTED: '4',
    STOPPING: '5',
    STOPPED: '6'
  },

  // 奖项状态名称
  PrizeStatusName: ['未知', '待抽选', '待抽选', '抽选中', '抽选中', '已抽选', '已抽选'],

  /** 奖项类型 */
  PrizeType: {
    CASH: '0',
    GOOD: '1',
  },

  /** 重复中奖 */
  PrizeMulti: {
    NO: '0',
    YES: '1',
  },

  /** 抽奖控制命令 */
  LottoControl: {
    READY: '0',
    START: '1',
    STOP: '2',
  },

  /** 返回结果代码 */
  ResultCode: {
    SUCCESS: '0',
    FAILED: '1',
  },

  /** 系统配置KEY */
  SysKey: {
    KEY_LOTTO: 'lotto',
    KEY_WINNER: 'winner'
  },

  /** 确认标识 */
  ConfirmFlag: {
    NONE: 0,
    RESET: 1,
    REMOVE: 2,
    REFRESH: 3
  },

  /** 排序调整方向 */
  Direct: {
    UP: 0,
    DOWN: 1,
  },

  /** 变换用时长 */
  TRANS_DURATION: 2000,

  /** 抽奖端应答延时 */
  SEND_DELAY: 2500,

  // 资源基础路径
  RES_BASE_URL: '/lotto/',

  // 入职年限
  WORK_YEAR_LIMIT: 14,

  /** 缩放标识 */
  ZoomFlag: {
    ZOOM_NONE: 0,
    ZOOM_IN: 1,
    ZOOM_OUT: 2
  },

  /** 高宽比例 */
  HW_RATIO: 16.0 / 9.0,

  /** 抽奖控制Websockset（控制端） */
  LOTTO_CONTROL: '/lotto/control',

  /** 抽奖控制Websockset（抽奖端） */
  LOTTO_CHANGEL: '/lotto/change',

  /** 状态控制Websockset（控制端） */
  STATUS_CONTROL: '/status/control',

  /** 状态控制Websockset（抽奖端） */
  STATUS_CHANGE: '/status/change',

  /** 状态控制Websockset（后台通知） */
  STATUS_BROADCAST: '/status/broadcast',

  /** 自定义事件 */
  RELOAD_WINNER: 'reloadwinner',

  /** 不限定抽奖组 */
  UNLIMIT_GROUP: '000000',

  /** 确认标识 */
  CamaraConfig: {
    INIT_RATE: 1.9,
    ZOOM_NONE: 1.0,
    ZOOM_OUT: 1.10,
    ZOOM_IN: 0.97,
    INIT_WIDTH: 8000,
    INIT_HEIGHT: 2000
  },

  /** 分隔符 */
  Delimiter: {
    GROUP: ';',
    ITEM: '#'
  },

  /** 最多分组数 */
  MAX_GROUPS: 6
};
