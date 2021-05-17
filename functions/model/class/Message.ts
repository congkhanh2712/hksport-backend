export default class Message {
    key: string | null;
    Message: string;
    Time: number;
    Seen: boolean;
    isMe: boolean;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Message = val.Message;
        this.Time = val.Time;
        this.Seen = val.Seen;
        this.isMe = val.isMe;
    }
}