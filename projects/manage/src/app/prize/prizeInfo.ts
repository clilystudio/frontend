export class PrizeInfo {
    isSelected: boolean;
    prizeId: string;
    prizeName: string;
    prizeDesc: string;
    prizeNumber: number;
    prizeWinner: number;
    empDeptno: string;
    prizeMulti: number;

    constructor() {
        this.init();
    }

    public init() {
        this.isSelected = false;
        this.prizeId = "";
        this.prizeName = "";
        this.prizeDesc = "";
        this.prizeNumber = 1;
        this.prizeWinner = 0;
        this.empDeptno = "";
        this.prizeMulti = 0;
    }
}