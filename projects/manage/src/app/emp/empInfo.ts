export class EmpInfo {
    isSelected: boolean;
    empId: string;
    empName: string;
    deptId: string;
    deptName: string;
    empRate: number;
    prizeFlag: number

    constructor() {
        this.init();
    }

    public init() {
        this.isSelected = false;
        this.empId = "";
        this.empName = "";
        this.deptId = "";
        this.deptName = "";
        this.empRate = 1;
        this.prizeFlag = 0;
    }
}