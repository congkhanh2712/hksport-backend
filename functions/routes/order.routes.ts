import { database, auth, messaging } from "firebase-admin";
import Order from '../model/class/Order';
import Role from '../model/class/Role';
const { Router } = require('express');
const router = Router();


//Get all user's order
router.get('/list', async (req: any, res: any) => {
    const { page, status } = req.query;
    try {
        var items: any[] = [];
        if (page != 0) {
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
        } else {
            await database().ref('TblOrder')
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
        }
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
    const { page, status, prevpage } = req.query;
    var temp = parseInt(prevpage);
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: Order[] = [];
                var length = 0;
                await database().ref('TblOrder')
                    .orderByChild('User').equalTo(decodeToken.uid)
                    .once('value', (data) => {
                        length = data.numChildren();
                    })
                if (page != 0) {
                    for (let i = temp; i <= temp; i++) {
                        items = [];
                        await database().ref('TblOrder')
                            .limitToLast(temp * 5)
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
                        if (items.length < page * 5 && temp * 5 < length) {
                            temp = temp + 1
                        }
                    }
                } else {
                    await database().ref('TblOrder')
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
                }
                for (let i = 0; i < items.length; i++) {
                    await database().ref('TblOrder')
                        .child(items[i].key as string).child('Timeline').child('Shipped').once('value', (data) => {
                            if (data.val() != null && data.val().Received != undefined) {
                                items[i].received = data.val().Received;
                            } else {
                                items[i].received = false;
                            }
                        })
                    var timeline = [{
                        time: items[0].OrderDate,
                        title: items[0].OrderTime,
                        description: '????n h??ng ??ang ???????c x??? l??',
                    }]
                    await database().ref('TblOrder')
                        .child(items[i].key as string).child('Timeline')
                        .once('value', (data) => {
                            data.forEach((snapshot) => {
                                switch (snapshot.key) {
                                    case 'Cancelled': {
                                        if (snapshot.val().Date != false) {
                                            timeline.push({
                                                time: snapshot.val().Date,
                                                title: snapshot.val().Time,
                                                description: '????n h??ng ???? b??? h???y',
                                            })
                                        }
                                        break;
                                    }
                                    case 'Shipped': {
                                        if (snapshot.val().Date != false) {
                                            timeline.push({
                                                time: snapshot.val().Date,
                                                title: snapshot.val().Time,
                                                description: '????n h??ng ???? ???????c shipper giao t???i n??i nh???n',
                                            })
                                        }
                                        break;
                                    }
                                    case 'Shipping': {
                                        if (snapshot.val().Date != false) {
                                            timeline.push({
                                                time: snapshot.val().Date,
                                                title: snapshot.val().Time,
                                                description: '????n h??ng ???? ???????c x??? l?? xong v?? ???? ???????c giao cho shipper',
                                            })
                                        }
                                        break;
                                    }
                                }
                            })
                        })
                    items[i].timeline = timeline;
                }
                return res.status(200).json({
                    succeed: true,
                    list: items.reverse(),
                    length: length,
                    prevpage: temp,
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
            description: '????n h??ng ??ang ???????c x??? l??',
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
                                    description: '????n h??ng ???? b??? h???y',
                                })
                            }
                            break;
                        }
                        case 'Shipped': {
                            if (snapshot.val().Date != false) {
                                timeline.push({
                                    time: snapshot.val().Date,
                                    title: snapshot.val().Time,
                                    description: '????n h??ng ???? ???????c shipper giao t???i n??i nh???n',
                                })
                            }
                            break;
                        }
                        case 'Shipping': {
                            if (snapshot.val().Date != false) {
                                timeline.push({
                                    time: snapshot.val().Date,
                                    title: snapshot.val().Time,
                                    description: '????n h??ng ???? ???????c x??? l?? xong v?? ???? ???????c giao cho shipper',
                                })
                            }
                            break;
                        }
                    }
                })
            })
        await database().ref('TblOrder')
            .child(req.params.id).child('Timeline').child('Shipped').once('value', (data) => {
                if (data.val() != null && data.val().Received != undefined) {
                    items[0].received = data.val().Received;
                }
            })
        items[0].timeline = timeline;
        return res.status(200).json(items[0]);
    } catch (error) {
        return res.status(500).send(error);
    }
})
// Update order detail (status)
router.put('/detail/:id', async (req: any, res: any) => {
    try {
        await database().ref('TblOrder')
            .child(req.params.id).update(req.body);
        var order: any;
        var user: any;
        if (req.body.Status != undefined && req.body.Status != '???? h???y') {
            var oldStatus = '';
            switch (req.body.Status) {
                case '??ang giao': {
                    oldStatus = '??ang x??? l??';
                    break;
                }
                case '???? giao': {
                    oldStatus = '??ang giao';
                    break;
                }
            }
            await database().ref('TblOrder')
                .child(req.params.id).once('value', child => {
                    order = child.val();
                })
            database().ref('TblNotification').child(order.User).push({
                OldStatus: oldStatus,
                NewStatus: req.body.Status,
                Note: req.body.Message,
                OrderID: req.params.id,
                Seen: false,
                Time: Date.now()
            })
            var token = '';
            await database().ref('TblCustomer').child(order.User)
                .once('value', (snap) => {
                    user = snap.val();
                    if (snap.val().Token != ''
                        && snap.val().Token != undefined) {
                        token = snap.val().Token;
                    }
                })
            if (req.body.Status == '???? giao') {
                var newrole = '';
                var rolelist: Role[] = [];
                await database().ref('TblRole').once('value', (snap) => {
                    snap.forEach(child => {
                        rolelist.push(new Role(child.key, child.val()));
                    })
                })
                for (let i = rolelist.length - 1; i >= 0; i--) {
                    if (user.Point + order.OrderPrice * order.RefundRate >= rolelist[i].MinPoint) {
                        newrole = rolelist[i].key as string;
                        i = 0;
                    }
                }
                database().ref('TblCustomer').child(order.User).update({
                    Point: user.Point + order.OrderPrice * order.RefundRate,
                    PointAvailable: user.PointAvailable + order.OrderPrice * order.RefundRate,
                    Role: newrole
                })
            }
            if (token != '') {
                messaging().send({
                    notification: {
                        body: '????n h??ng c???a b???n ???? thay ?????i tr???ng th??i',
                        title: 'Th??ng b??o',
                    },
                    data: {
                        type: 'Order',
                        id: '',
                    },
                    token: token
                })
            }
        }
        return res.status(200).json({
            succeed: true,
            message: "???? update th??nh c??ng"
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
            message: "???? update th??nh c??ng"
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
            message: "???? update th??nh c??ng"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Create new order
router.post('/create', async (req: any, res: any) => {
    try {
        const { payment, paystatus, shiptype, cartItems,
            shipmoney, money, discount, benefit, pointUsed, pointAvailable,
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
                database().ref('TblCustomer').child(decodeToken.uid).update({
                    PointAvailable: pointAvailable - pointUsed,
                })
                if (km != '') {
                    database().ref('TblVoucher')
                        .orderByChild('Code').equalTo(km)
                        .once('value', snap => {
                            snap.forEach(child => {
                                if (child.val().Limited != -1 && child.val().Limited != 0) {
                                    database().ref('TblVoucher').child(child.key as string)
                                        .child('Limited').set(child.val().Limited - 1);
                                }
                            })
                        })
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
                    Status: '??ang x??? l??',
                    User: decodeToken.uid,
                    RefundRate: benefit.Refund,
                    PointUsed: pointUsed,
                    TotalPrice: money + shipmoney - discount - pointUsed,
                    Note: note,
                    Rating: 0,
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
                        //?????y to??n b??? gi??? h??ng v??o m???c chi ti???t ????n h??ng
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
                    message: "???? t???o order"
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