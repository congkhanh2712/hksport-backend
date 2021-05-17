import { database, auth } from "firebase-admin";
import Order from '../model/class/Order';
const { Router } = require('express');
const router = Router();


//Get all user's order
router.get('/list', async (req: any, res: any) => {
    const { page, status } = req.query;
    try {
        var items: any[] = [];
        await database().ref('TblOrder')
            .limitToLast(parseInt(page) * 5)
            .once('value', (data: any) => {
                data.forEach((snap: any) => {
                    if (status.toLowerCase() == 'all') {
                        let order = new Order(snap.key, snap.val())
                        items.push(order);
                    } else {
                        if (snap.val().Status.toLowerCase() == status.toLowerCase()) {
                            let order = new Order(snap.key, snap.val())
                            items.push(order);
                        }
                    }
                })
            })
        return res.status(200).json({
            succeed: true,
            list: items.reverse()
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get user's Orders
router.get('/list/user', async (req: any, res: any) => {
    const { page, status } = req.query;
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: Order[] = [];
                var length = 0;
                console.log(req.query.page)
                await database().ref('TblOrder')
                    .limitToLast(parseInt(page) * 5)
                    .orderByChild('User').equalTo(decodeToken.uid)
                    .once('value', (data: any) => {
                        data.forEach((snap: any) => {
                            if (status.toLowerCase() == 'all') {
                                items.push(new Order(snap.key, snap.val()));
                            } else {
                                if (snap.val().Status.toLowerCase() == status.toLowerCase()) {
                                    items.push(new Order(snap.key, snap.val()));
                                }
                            }
                        })
                    })
                await database().ref('TblOrder')
                    .orderByChild('User').equalTo(decodeToken.uid)
                    .once('value', (data) => {
                        length = data.numChildren();
                    })
                return res.status(200).json({
                    succeed: true,
                    list: items.reverse(),
                    length: length
                });
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
// Get order detail
router.get('/detail/:id', async (req: any, res: any) => {
    try {
        var items: Order[] = [];
        await database().ref('TblOrder')
            .child(req.params.id)
            .once('value', (data) => {
                items.push(new Order(req.params.id, data.val()))
            })
        var timeline = [{
            time: items[0].OrderDate,
            title: items[0].OrderTime,
            description: 'Đơn hàng đang được xử lý',
        }]
        await database().ref('TblOrder')
            .child(req.params.id).child('Timeline')
            .once('value', (data) => {
                data.forEach((snapshot) => {
                    switch (snapshot.key) {
                        case 'Cancelled': {
                            if (snapshot.val().Date != false) {
                                timeline.push({
                                    time: snapshot.val().Date,
                                    title: snapshot.val().Time,
                                    description: 'Đơn hàng đã bị hủy',
                                })
                            }
                            break;
                        }
                        case 'Shipped': {
                            if (snapshot.val().Date != false) {
                                timeline.push({
                                    time: snapshot.val().Date,
                                    title: snapshot.val().Time,
                                    description: 'Đơn hàng đã được shipper giao tới nơi nhận',
                                })
                            }
                            break;
                        }
                        case 'Shipping': {
                            if (snapshot.val().Date != false) {
                                timeline.push({
                                    time: snapshot.val().Date,
                                    title: snapshot.val().Time,
                                    description: 'Đơn hàng đã được xử lý xong và đã được giao cho shipper',
                                })
                            }
                            break;
                        }
                    }
                })
            })
        await database().ref('TblOrder')
            .child(req.params.id).child('Timeline').child('Shipped').once('value', (received) => {
                if (received.val() != undefined) {
                    items[0].received = received.val().Received
                }
            })
        items[0].timeline = timeline;
        return res.status(200).json(items[0]);
    } catch (error) {
        return res.status(500).send(error);
    }
})
// Update order detail
router.put('/detail/:id', async (req: any, res: any) => {
    try {
        await database().ref('TblOrder')
            .child(req.params.id).update(req.body);
        return res.status(200).json({
            succeed: true,
            message: "Đã update thành công"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
// Add timeline of order detail
router.post('/detail/:id', async (req: any, res: any) => {
    try {
        var today = new Date();
        var second = today.getSeconds().toString();
        var minutes = today.getMinutes().toString();
        if (today.getSeconds() < 10) {
            second = '0' + today.getSeconds();
        }
        if (today.getMinutes() < 10) {
            minutes = '0' + today.getMinutes();
        }
        await database().ref('TblOrder')
            .child(req.params.id).child('Timeline')
            .child(req.body.status).update({
                Date: today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
                Time: today.getHours() + ':' + minutes + ':' + second,
            })
        return res.status(200).json({
            succeed: true,
            message: "Đã update thành công"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update Received status
router.put('/received/:id', async (req: any, res: any) => {
    try {
        await database().ref('TblOrder')
            .child(req.params.id).child('Timeline').child('Shipped')
            .update(req.body);
        return res.status(200).json({
            succeed: true,
            message: "Đã update thành công"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Create new order
router.post('/create', async (req: any, res: any) => {
    try {
        const { payment, paystatus, shiptype, cartItems,
            shipmoney, money, discount, benefit, pointUsed,
            note, km, name, phone, city, address, ward, district } = req.body;
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var today = new Date();
                var second = today.getSeconds().toString();
                var minutes = today.getMinutes().toString();
                if (today.getSeconds() < 10) {
                    second = '0' + today.getSeconds();
                }
                if (today.getMinutes() < 10) {
                    minutes = '0' + today.getMinutes();
                }
                var orderkey = database().ref('TblOrder').push({
                    Payments: payment,
                    PayStatus: paystatus,
                    OrderDate: today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
                    OrderTime: today.getHours() + ':' + minutes + ':' + second,
                    ShipType: shiptype,
                    ShipCost: shipmoney,
                    OrderPrice: money,
                    Discount: discount,
                    Status: 'Đang xử lý',
                    User: decodeToken.uid,
                    RefundRate: benefit.Refund,
                    PointUsed: pointUsed,
                    TotalPrice: money + shipmoney - discount - pointUsed,
                    Note: note,
                    Rating: false,
                    Voucher: km,
                    Comment: "",
                }).key;
                if (orderkey != null) {
                    database().ref('TblOrder').child(orderkey).child('Address').update({
                        Name: name,
                        Phone: phone,
                        City: city,
                        Detail: address,
                        Ward: ward,
                        District: district,
                    })
                    for (let i = 0; i < cartItems.length; i++) {
                        //Đẩy toàn bộ giỏ hàng vào mục chi tiết đơn hàng
                        database().ref('TblOrder').child(orderkey)
                            .child('OrderDetail').child(cartItems[i].ProductID + cartItems[i].Size)
                            .update({
                                Name: cartItems[i].Name,
                                ProductID: cartItems[i].ProductID,
                                Size: cartItems[i].Size,
                                Quantity: cartItems[i].Quantity,
                                Price: cartItems[i].Price,
                                Image: cartItems[i].Image,
                            })
                    }
                }
                return res.status(200).json({
                    succeed: true,
                    message: "Đã tạo order"
                });
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})





module.exports = router;