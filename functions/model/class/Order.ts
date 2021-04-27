export default class Order {
    id!: string;
    detail: any = {
        Comment: String,
        Note: String,
        OrderDate: String,
        OrderPrice: Number,
        OrderTime: String,
        PayStatus: Boolean,
        Payments: String,
        Rating: Number,
        ShipCost: Number,
        ShipType: String,
        Status: String,
        TotalPrice: Number,
        User: String,
        PointUsed: Number,
        RefundRate: Number,
        Discount: Number,
        Voucher: String,
    };
    Address:any = {
        City: String,
        Detail: String,
        District: String,
        Name: String,
        Phone: String,
        Ward: String,
    };
    constructor(key: string, val: any) {
        this.id = key;
        this.Address = val.Address;
        this.detail.Comment = val.Comment;
        this.detail.Note = val.Note;
        this.detail.OrderDate = val.OrderDate;
        this.detail.OrderPrice = val.OrderPrice;
        this.detail.PayStatus = val.PayStatus;
        this.detail.ShipCost = val.ShipCost;
        this.detail.ShipType = val.ShipType;
        this.detail.Status = val.Status;
        this.detail.TotalPrice = val.TotalPrice;
        this.detail.User = val.User;
        this.detail.Rating = val.Rating;
        this.detail.Payments = val.Payments;
        this.detail.Voucher = val.Voucher;
        this.detail.Discount = val.Discount;
        if (val.PointUsed != undefined) {
            this.detail.PointUsed = val.PointUsed;
        } else {
            this.detail.PointUsed = 0;
        }
        if (val.RefundRate != undefined) {
            this.detail.RefundRate = val.RefundRate;
        } else {
            this.detail.RefundRate = 0;
        }
        this.detail.OrderTime = val.OrderTime;
    }
}