const { Router } = require('express');
const router = Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'congkhanh271299@gmail.com',
        pass: 'congkhanh2712'
    }
});
function createVerifyCode(length: number) {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
router.post('', async (req: any, res: any) => {
    const { email } = req.body;
    try {
        var code = createVerifyCode(7)
        var mailOptions = {
            from: 'HK SPORT',
            to: email,
            subject: 'XÁC NHẬN ĐĂNG KÝ TÀI KHOẢN HK SPORT',
            html: '<h3>MÃ XÁC NHẬN CỦA BẠN LÀ: ' + code +
                '</h3><p>Email của bạn vừa được dùng để đăng ký tài khoản tại HK SPORT.</p>' + '<p>Nếu không phải bạn, vui lòng bỏ qua email này</p>',
        };
        transporter.sendMail(mailOptions, (err: any, info: any) => {
            if (err) {
                res.status(200).json({
                    succeed: false,
                    error: err
                })
            } else {
                res.status(200).json({
                    succeed: true,
                    code: code
                })
            }
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})


module.exports = router;