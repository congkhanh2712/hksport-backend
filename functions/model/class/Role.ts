export default class Role {
    key: string | null;
    Benefit={};
    Name: string;
    Color: string;
    MinPoint: number;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.Benefit = val.Benefit;
        this.Color = val.Color;
        this.MinPoint = val.MinPoint;
    }
}