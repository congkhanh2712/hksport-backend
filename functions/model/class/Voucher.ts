export default class Voucher {
    key: string | null;
    Code: string;
    DateEnd: string;
    DateStart: string;
    Description: string;
    Discount: string;
    Icon: string;
    Image: string;
    Limited: number;
    Max: number;
    Name: string;
    Role: string;
    Time: number;
    ValidFrom: number;
    InitQuantity: number;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Code = val.Code;
        this.DateEnd = val.DateEnd;
        this.DateStart = val.DateStart;
        this.Description = val.Description;
        this.Discount = val.Discount;
        this.Icon = val.Icon;
        this.Image = val.Image;
        this.Limited = parseInt(val.Limited);
        this.Max = parseInt(val.Max);
        this.Name = val.Name;
        this.Role = val.Role;
        this.Time = parseInt(val.Time);
        this.ValidFrom = parseInt(val.ValidFrom);
        if (val.InitQuantity == undefined) {
            this.InitQuantity = parseInt(val.Limited);
        } else {
            this.InitQuantity = val.InitQuantity
        }
    }
}