export default class Brand {
    key: string | null;
    Icon: string;
    Name: string;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.Icon = val.Icon;
    }
}