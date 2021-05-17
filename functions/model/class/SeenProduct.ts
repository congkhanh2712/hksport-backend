export default class SeenProduct {
    key: string | null;
    Name: string;
    Image: string;
    Price: number;
    Remove: boolean;
    Liked: boolean;
    Time: number;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.Image = val.Image;
        this.Price = parseInt(val.Price);
        this.Remove = val.Remove;
        this.Time = parseInt(val.Time);
        if (val.Liked != undefined) {
            this.Liked = val.Liked;
        } else {
            this.Liked = false;
        }
    }
}