export default class Order {
    id!: string;
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
    constructor(key: string, val: any) {
        this.id = key;
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
        this.Discount = val.Discount;
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
    }
}