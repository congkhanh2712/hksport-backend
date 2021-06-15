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
    Size:number | Object = {};
    constructor(key: string | null, val: any) {
        this.key = key;
        this.Name = val.Name;
        this.CategoryID = val.CategoryID;
        this.Color = val.Color;
        this.Image = val.Image;
        this.Material = val.Material;
        this.Price = val.Price;
        this.Product_Type = val.Product_Type;
        this.Rating = val.Rating;
        this.Sold = val.Sold;
        if (val.Source == undefined || val.Source == '') {
            this.Source = "Chưa cập nhật";
        } else {
            this.Source = val.Source;
        }
        if (val.Size != undefined) {
            this.Size = val.Size;
        }
        if (val.BrandID != '') {
            this.BrandID = val.BrandID;
        }
        else {
            this.BrandID = 'Chưa cập nhật';
        }
        if (val.Description != '') {
            this.Description = val.Description;
        } else {
            this.Description = 'Chưa cập nhật';
        }
        if (val.CompetitionID != undefined) {
            this.CompetitionID = val.CompetitionID;
        } else {
            this.CompetitionID = '';
        }
    }
}