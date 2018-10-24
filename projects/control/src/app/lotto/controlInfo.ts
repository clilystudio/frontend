export class ControlInfo {
    prizeId: string;
    prizeStatus: number;
    prizePerson: number;
    prizeCommand: number;

    constructor() {
        this.init();
    }

    public init() {
        this.prizeId = "";
        this.prizeStatus = 0;
        this.prizePerson = 1;
        this.prizeCommand = 0;
    }
}