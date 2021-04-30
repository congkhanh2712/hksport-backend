export default class Product {
    key: string | null;
    Name: string;
    BrandID: string;
    CategoryID: string;
    Color: string;
    CompetitionID: string;
    Description: string;
    Image: string;
    Material: string;
    Price: number;
    Product_Type: string;
    Rating: number;
    Source: string;
    Sold: number;
    Size = {};
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.BrandID = val.BrandID;
        this.CategoryID = val.CategoryID;
        this.Color = val.Color;
        this.CompetitionID = val.CompetitionID;
        this.Description = val.Description;
        this.Image = val.Image;
        this.Material = val.Material;
        this.Price = val.Price;
        this.Product_Type = val.Product_Type;
        this.Rating = val.Rating;
        if(val.Source == undefined || val.Source == ''){
            this.Source = "Chưa cập nhật";
        } else {
            this.Source = val.Source;
        }
        this.Sold = val.Sold;
        if (val.Size != undefined) {
            this.Size = val.Size;
        }
    }
}