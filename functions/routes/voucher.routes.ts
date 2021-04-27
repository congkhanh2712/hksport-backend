import { messaging, database } from "firebase-admin";
import Voucher from '../model/class/Voucher';

const { Router } = require('express');
const router = Router();

//Create voucher
router.post('', async (req: any, res: any) => {
    try {
        var item = new Voucher(req.body);
        database().ref('TblVoucher').push(item);
        var point = 0;
        await database().ref('TblRole').child(item.Role).child('MinPoint').once('value', (val) => {
            point = val.val();
        })
        var tokens: string[] = [];
        await database().ref('TblCustomer').once('value', (snap) => {
            console.log(point)
            snap.forEach(child => {
                console.log(child.val().Point)
                if (child.val().Point >= point
                    && child.val().Token != '' && child.val().Token != undefined) {
                    tokens.push(child.val().Token)
                }
            })
        })
        messaging().sendMulticast({
            notification: {
                body: item.Description,
                title: item.Name,
                imageUrl: item.Icon,
            },
            tokens: tokens
        }).then(() => {
            return res.status(200).json({
                succeed: true,
                message: 'Gửi thông báo thành công',
            })
        }).catch(() => {
            return res.status(200).json({
                succeed: false,
                message: 'Gửi thông báo không thành công',
            })
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})


module.exports = router;