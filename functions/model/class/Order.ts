export default class Order {
    key: string | null;
    Comment: String;
    Note: String;
    OrderDate: String;
    OrderPrice: Number;
    OrderTime: String;
    PayStatus: Boolean;
    Payments: String;
    Rating: Number;
    ShipCost: Number;
    ShipType: String;
    Status: String;
    TotalPrice: Number;
    User: String;
    PointUsed: Number;
    RefundRate: Number;
    Discount: Number;
    Voucher: String;
    Address = {};
    OrderDetail: any[] = [];
    Timeline: any[] = [];
    Received=false;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Address = val.Address;
        this.Comment = val.Comment;
        this.Note = val.Note;
        this.OrderDate = val.OrderDate;
        this.OrderPrice = val.OrderPrice;
        this.PayStatus = val.PayStatus;
        this.ShipCost = val.ShipCost;
        this.ShipType = val.ShipType;
        this.Status = val.Status;
        this.TotalPrice = val.TotalPrice;
        this.User = val.User;
        this.Rating = val.Rating;
        this.Payments = val.Payments;
        this.Voucher = val.Voucher;
        if (val.Discount != undefined) {
            this.Discount = val.Discount;
        } else {
            this.Discount = 0;
        }
        if (val.PointUsed != undefined) {
            this.PointUsed = val.PointUsed;
        } else {
            this.PointUsed = 0;
        }
        if (val.RefundRate != undefined) {
            this.RefundRate = val.RefundRate;
        } else {
            this.RefundRate = 0;
        }
        this.OrderTime = val.OrderTime;
        for (const [key, value] of Object.entries(val.OrderDetail)) {
            console.log(key);
            this.OrderDetail.push(value);
        }
    }
    public get timeline() {
        return this.Timeline;
    }
    public set timeline(obj: any) {
        this.Timeline = obj;
    }
    public get received(){
        return this.Received;
    }
    public set received(Received: boolean){
        this.Received = Received;
    }
}