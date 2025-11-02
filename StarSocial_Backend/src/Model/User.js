const { ulid } = require('ulid');
class User {
    constructor({
        User_id,
        Last_name,
        Email,
        First_Name,
        Password,
        Salt,

        // --- Các trường tùy chọn (có thể null hoặc có default) ---
        Role = 'starer', // Đặt default 'User' hoặc null tùy bạn
        Date_Of_Birth = null,
        Profile_Picture = null,
        Description = null,
        Reliability = null,
        gender, // Giả sử default là 'New'

        // --- Các trường có DEFAULT 0 trong DB ---
        isLocked = 0, // 0 là false
        ReportedPosts = 0,
        Quantities_Posts = 0,
        QuantitiesFollowers = 0

        // --- Ghi chú ---
        // [Created_at] không cần truyền vào, 
        // vì database đã có DEFAULT GETDATE() tự động xử lý.
    }) {
        this._User_id = User_id || ulid();
        this._Last_name = Last_name;
        this._Email = Email;
        this._First_Name = First_Name;
        this._Password = Password;
        this._Salt = Salt;
        this._Role = Role;
        this._gender = gender;
        this._Date_Of_Birth = Date_Of_Birth;
        this._Profile_Picture = Profile_Picture;
        this._Description = Description;
        this._Reliability = Reliability;
        this._isLocked = isLocked;
        this._ReportedPosts = ReportedPosts;
        this._Quantities_Posts = Quantities_Posts;
        this._QuantitiesFollowers = QuantitiesFollowers;
    }
}

module.exports = User;