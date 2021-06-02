export default class Rating {
    key: string | null;
    Comment: string;
    Date: string;
    Liked = {};
    OrderId: string;
    ProductID: string;
    Rating: number;
    Replied = {};
    Size: string;
    Time: string;
    User: string;
    Username = '';
    Images = {};
    Avatar = '';
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Comment = val.Comment;
        this.Date = val.Date;
        this.OrderId = val.OrderId;
        this.ProductID = val.ProductID;
        this.Rating = val.Rating;
        this.Size = val.Size;
        this.Time = val.Time;
        this.User = val.User;
        if (val.Liked != undefined) {
            this.Liked = val.Liked;
        }
        if (val.Replied != undefined) {
            this.Replied = val.Replied;
        }
        if (val.Images != undefined) {
            this.Images = val.Images;
        }
    }
    public get username() {
        return this.Username;
    }
    public set username(name: string) {
        this.Username = name;
    }
    public get avatar() {
        return this.Avatar;
    }
    public set avatar(link: string) {
        if (link != undefined) {
            this.Avatar = link;
        }
    }
}