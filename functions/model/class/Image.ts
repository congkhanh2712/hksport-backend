export default class Image {
    key: string;
    Link: string;
    Product_id: string;
    constructor(key: string, val: any) {
        this.key = key;
        this.Product_id = val.Product_id;
        this.Link = val.Link;
    }
}