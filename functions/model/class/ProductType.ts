export default class Product {
    key: string | null;
    BrandID: string;
    CategoryID: string;
    Link: string;
    Name: string;
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.CategoryID = val.CategoryID;
        this.BrandID = val.BrandID;
        this.Link = val.Link;
    }
}