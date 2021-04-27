export default class Product {
    id!: string | null;
    detail: any = {
        Name: String,
        BrandID: String,
        CategoryID: String,
        Color: String,
        CompetitionID: String,
        Description: String,
        Image: String,
        Material: String,
        Price: Number,
        Product_Type: String,
        Rating: Number,
        Sold: Number,
    };
    size: any[] = [];
    constructor(key: string | null, val: any) {
        this.id = key;
        this.detail.Name = val.Name;
        this.detail.BrandID = val.BrandID;
        this.detail.CategoryID = val.CategoryID;
        this.detail.Color = val.Color;
        this.detail.CompetitionID = val.CompetitionID;
        this.detail.Description = val.Description;
        this.detail.Image = val.Image;
        this.detail.Material = val.Material;
        this.detail.Price = val.Price;
        this.detail.Product_Type = val.Product_Type;
        this.detail.Rating = val.Rating;
        this.detail.Sold = val.Sold;
        if (val.Size != undefined) {
            for (const[key,value] of Object.entries(val.Size)){
                this.size.push({
                    key: key,
                    quantity: value,
                })
            }
        }
    }
}