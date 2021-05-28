export default class User {
    Name: string;
    Phone_Number: string;
    Email = '';
    Point: number;
    PointAvailable: number;
    Address = {};
    Role: string;
    RoleName = '';
    Token: string;
    Color = '';
    CreateDate = '';
    Avatar = '';
    constructor(val: any) {
        this.Name = val.Name;
        this.Phone_Number = val.Phone_Number;
        this.Point = val.Point;
        this.PointAvailable = val.PointAvailable;
        this.Address = val.Address;
        this.Role = val.Role;
        if (val.Token != undefined) {
            this.Token = val.Token;
        } else {
            this.Token = '';
        }
        if (val.Avatar != undefined) {
            this.Avatar = val.Avatar;
        }
    }
    public get rolename() {
        return this.RoleName;
    }
    public set rolename(name: string) {
        this.RoleName = name;
    }
    public get color() {
        return this.Color;
    }
    public set color(name: string) {
        this.Color = name;
    }
    public get createdate() {
        return this.CreateDate;
    }
    public set createdate(value: string) {
        this.CreateDate = value.substring(0, 10);
    }
    public get email() {
        return this.Email;
    }
    public set email(input: string | undefined) {
        if (input != undefined) {
            this.Email = input;
        }
    }
}