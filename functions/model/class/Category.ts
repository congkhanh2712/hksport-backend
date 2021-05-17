export default class Category {
    key: string | null;
    Icon: string;
    Image: string;
    Name: string;
    SmallImage: string;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.Icon = val.Icon;
        this.Image = val.Image;
        this.SmallImage = val.SmallImage;
    }
}