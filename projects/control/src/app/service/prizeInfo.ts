export class PrizeInfo {
    prizeId: string;
    prizeName: string;
    prizeDesc: string;
    prizeOrder: number;
    prizeNumber: number;
    prizeWinner: number;
    deptId: string;
    prizeMulti: number;
    prizeStatus: number;
    prizePerson: number;

    constructor() {
        this.init();
    }

    public init() {
        this.prizeId = "";
        this.prizeName = "";
        this.prizeDesc = "";
        this.prizeOrder = 0;
        this.prizeNumber = 1;
        this.prizeWinner = 0;
        this.deptId = "";
        this.prizeMulti = 0;
        this.prizeStatus = 0;
        this.prizePerson = 1;
    }
}