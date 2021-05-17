export default class Notification {
    key: string | null;
    NewStatus: string;
    OldStatus: string;
    Note: string;
    OrderID: string;
    Time: string;
    Seen: boolean;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.NewStatus = val.NewStatus;
        this.Time = val.Time;
        this.Seen = val.Seen;
        this.OldStatus = val.OldStatus;
        this.Note = val.Note;
        this.OrderID = val.OrderID;
    }
}