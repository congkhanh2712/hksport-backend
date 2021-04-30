export default class Product {
    key: string | null;
    Banner: string;
    Link: string;
    Name: string;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.Banner = val.Banner;
        this.Link = val.Link;
    }
}