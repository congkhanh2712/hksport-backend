import { messaging, database } from "firebase-admin";
import Voucher from '../model/class/Voucher';

const { Router } = require('express');
const router = Router();

//Create voucher
router.post('', async (req: any, res: any) => {
    try {
        database().ref('TblVoucher').push(req.body);
        var point = 0;
        await database().ref('TblRole').child(req.body.Role).child('MinPoint').once('value', (val) => {
            point = val.val();
        })
        var tokens: string[] = [];
        await database().ref('TblCustomer').once('value', (snap) => {
            snap.forEach(child => {
                if (child.val().Point >= point
                    && child.val().Token != '' && child.val().Token != undefined) {
                    tokens.push(child.val().Token)
                }
            })
        })
        messaging().sendMulticast({
            notification: {
                body: req.body.Description,
                title: req.body.Name,
                imageUrl: req.body.Icon,
            },
            data: {
                type: 'Voucher',
                id: '',
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
//Get available vouchers
//Kiểm tra ngày hiện tại có phù hợp với khuyến mãi ko
function isValidDate(d1: string, d2: string) {
    var day1 = tranDay(d1);
    var day2 = tranDay(d2);
    var today1 = new Date();
    var today2 = new Date(today1.getFullYear(), today1.getMonth(), today1.getDate()).getTime();
    if (day1 <= today2 && today2 <= day2) return true;
    else return false;
}
function tranDay(ngay: string) {
    var d = '';
    var m = '';
    var y = '';
    for (let i = 0; i < 3; i++) {
        if (ngay[i] === '/') {
            d = ngay.slice(0, i);
            for (let j = i + 1; j < ngay.length; j++) {
                if (ngay[j] === '/') {
                    m = ngay.slice(i + 1, j);
                    y = ngay.slice(j + 1, ngay.length);
                }
            }
        }
    }
    return (new Date(parseInt(y), parseInt(m) - 1, parseInt(d))).getTime();
}
router.get('', async (req: any, res: any) => {
    try {
        var items: Voucher[] = [];
        await database().ref('TblVoucher').once('value', async (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (isValidDate(childSnapshot.val().DateStart, childSnapshot.val().DateEnd) == true && childSnapshot.val().Limited != 0) {
                    items.push(new Voucher(childSnapshot.key, childSnapshot.val()))
                }
            });
        })
        return res.status(200).json({
            succeed: true,
            list: items.reverse(),
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get All vouchers
router.get('/all', async (req: any, res: any) => {
    try {
        var items: Voucher[] = [];
        var length = 0;
        await database().ref('TblVoucher')
            .once('value', async (snapshot) => {
                length = snapshot.numChildren();
            })
        if (parseInt(req.query.page) != 0) {
            await database().ref('TblVoucher')
                .limitToLast(parseInt(req.query.page) * 10)
                .once('value', async (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        items.push(new Voucher(childSnapshot.key, childSnapshot.val()))
                    });
                })
        } else {
            await database().ref('TblVoucher')
                .once('value', async (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        items.push(new Voucher(childSnapshot.key, childSnapshot.val()))
                    });
                })
        }
        return res.status(200).json({
            succeed: true,
            list: items.reverse(),
            length: length
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get voucher detail by id
router.get('/:vid', async (req: any, res: any) => {
    try {
        await database().ref('TblVoucher').child(req.params.vid)
            .once('value', async (data) => {
                var role = {
                    RoleName: '',
                    MinPoint: 0,
                }
                await database().ref('TblRole')
                    .orderByKey().equalTo(data.val().Role)
                    .once('value', (snapshot) => {
                        snapshot.forEach((childsnapshot) => {
                            role.RoleName = childsnapshot.val().Name;
                            role.MinPoint = childsnapshot.val().MinPoint;
                        })
                    })
                return res.status(200).json({
                    succeed: true,
                    detail: new Voucher(req.params.vid, data.val()),
                    role: role
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})




module.exports = router;