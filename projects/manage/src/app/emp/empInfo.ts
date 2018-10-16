export class EmpInfo {
    isSelected: boolean;
    empId: string;
    empCname: string;
    empFname: string;
    empLname: string;
    empDeptno: string;
    empDeptname: string;
    empRate: number;
    prizeFlag: number

    constructor() {
        this.isSelected = false;
        this.empId = "";
        this.empCname = "";
        this.empFname = "";
        this.empLname = "";
        this.empDeptno = "";
        this.empDeptname = "";
        this.empRate = 1;
        this.prizeFlag = 0;
    }
}