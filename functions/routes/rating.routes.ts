import { database, auth, messaging } from "firebase-admin";
import Rating from '../model/class/Rating';

const { Router } = require('express');
const router = Router();
const db = database()



router.get('', async (req: any, res: any) => {
    var items: Rating[] = [];
    await db.ref('TblRating').once("value", (snapshot) => {
        snapshot.forEach(function (child) {
            var item = new Rating(child.key, child.val());
            items.push(item);
        });
    })
    return res.status(200).json({
        succeed: true,
        list: items.reverse(),
    });
})
//Get product's rating length
router.get('/:pid', async (req: any, res: any) => {
    var length = 0;
    var items: Rating[] = [];
    await db.ref('TblRating')
        .orderByChild('ProductID').equalTo(req.params.pid)
        .once('value', (snapshot) => {
            length = snapshot.numChildren();
        })
    if (parseInt(req.query.page) != 0) {
        await db.ref('TblRating')
            .orderByChild('ProductID').equalTo(req.params.pid)
            .limitToLast(parseInt(req.query.page) * 4)
            .once('value', async (snapshot) => {
                snapshot.forEach(child => {
                    var item = new Rating(child.key, child.val());
                    items.push(item);
                })
            })
    } else {
        await db.ref('TblRating')
            .orderByChild('ProductID').equalTo(req.params.pid)
            .once('value', async (snapshot) => {
                snapshot.forEach(child => {
                    var item = new Rating(child.key, child.val());
                    items.push(item);
                })
            })
    }
    for (let i = 0; i < items.length; i++) {
        await db.ref('TblCustomer').child(items[i].User)
            .once('value', (data) => {
                items[i].username = data.val().Name;
                items[i].avatar = data.val().Avatar;
            })
    }
    return res.status(200).json({
        succeed: true,
        length: length,
        list: items.reverse(),
    });
})
//Get product's rating overview
router.get('/overview/:pid', async (req: any, res: any) => {
    var items = [0, 0, 0, 0, 0, 0];
    await db.ref('TblRating').orderByChild('ProductID').equalTo(req.params.pid).once('value', (snapshot) => {
        snapshot.forEach((child) => {
            items[0]++;
            items[child.val().Rating]++;
        })
    })
    return res.status(200).json({
        succeed: true,
        list: items,
    });
})
//Get like number of rating
router.get('/liked/:pid', async (req: any, res: any) => {
    var likedNumber = 0;
    await db.ref('TblRating').child(req.params.pid).child('Liked')
        .once('value', (snapshot) => {
            if (snapshot.val() != undefined) {
                likedNumber = snapshot.numChildren();
            } else {
                likedNumber = 0;
            }
        })
    var liked = false;
    if (req.headers['x-access-token'] != null) {
        await auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await db.ref('TblRating').child(req.params.pid).child('Liked')
                    .child(decodeToken.uid)
                    .once('value', (snapshot) => {
                        if (snapshot.val() != undefined) {
                            liked = true
                        }
                    })
            })
    }
    return res.status(200).json({
        succeed: true,
        likedNumber: likedNumber,
        liked: liked,
    });
})
//Get replied data of a rating
router.get('/replied/:pid', async (req: any, res: any) => {
    var length = 0;
    var items: any[] = [];
    await db.ref('TblRating').child(req.params.pid).child('Replied')
        .once('value', (snapshot) => {
            if (snapshot.val() != undefined) {
                length = snapshot.numChildren();
            } else {
                length = 0;
            }
        })
    if (parseInt(req.query.page) != 0) {
        await db.ref('TblRating').child(req.params.pid).child('Replied')
            .limitToLast(parseInt(req.query.page) * 6).once('value', (snapshot) => {
                snapshot.forEach((child) => {
                    items.push({
                        key: child.key,
                        detail: child.val(),
                        Username: '',
                        isMe: false,
                        Avatar: '',
                    })
                })
            })
    } else {
        await db.ref('TblRating').child(req.params.pid).child('Replied')
            .once('value', (snapshot) => {
                snapshot.forEach((child) => {
                    items.push({
                        key: child.key,
                        detail: child.val(),
                        Username: '',
                        isMe: false,
                        Avatar: '',
                    })
                })
            })
    }
    for (let i = 0; i < items.length; i++) {
        await db.ref('TblCustomer').child(items[i].detail.User)
            .once('value', (data) => {
                console.log(items[i].detail.User + ' - ' + data.val().Name)
                items[i].Username = data.val().Name;
                items[i].Avatar = data.val().Avatar;
            })
        if (req.headers['x-access-token'] != null) {
            await auth().verifyIdToken(req.headers['x-access-token'], true)
                .then(async (decodeToken) => {
                    if (decodeToken.uid == items[i].detail.User) {
                        items[i].isMe = true
                    }
                })
        }
    }
    return res.status(200).json({
        succeed: true,
        length: length,
        list: items.reverse(),
    });
})
//Remove a replied
router.delete('/replied/:rid/:cid', async (req: any, res: any) => {
    await db.ref('TblRating').child(req.params.rid).child('Replied')
        .child(req.params.cid).remove()
    return res.status(200).json({
        succeed: true,
        message: "Đã xóa bình luận"
    });
})
//Press Like button of a rating
router.put('/liked/:pid', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                if (req.body.liked == false) {
                    var today = new Date();
                    var second = today.getSeconds().toString();
                    var minutes = today.getMinutes().toString();
                    if (today.getSeconds() < 10) {
                        second = '0' + today.getSeconds();
                    }
                    if (today.getMinutes() < 10) {
                        minutes = '0' + today.getMinutes();
                    }
                    await database().ref('TblRating').child(req.params.pid).child('Liked')
                        .child(decodeToken.uid).set({
                            Date: today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
                            Time: today.getHours() + ':' + minutes + ':' + second,
                        })
                } else {
                    await database().ref('TblRating').child(req.params.pid).child('Liked')
                        .child(decodeToken.uid).remove();
                }
                return res.status(200).json({
                    succeed: true,
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
//Get Rating detail
router.get('/detail/:rid', async (req: any, res: any) => {
    try {
        var items: Rating[] = [];
        await db.ref('TblRating').child(req.params.rid)
            .once('value', (snapshot) => {
                var item = new Rating(snapshot.key, snapshot.val())
                items.push(item)
            })
        await db.ref('TblCustomer').child(items[0].User)
            .once('value', (data) => {
                items[0].username = data.val().Name;
                items[0].avatar = data.val().Avatar;
            })
        return res.status(200).json({
            succeed: true,
            detail: items[0],
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Add a reply
router.post('/replied/:rid', async (req: any, res: any) => {
    try {
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
                await database().ref('TblRating')
                    .child(req.params.rid).child('Replied')
                    .push({
                        User: decodeToken.uid,
                        Date: today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
                        Time: today.getHours() + ':' + minutes + ':' + second,
                        Comment: req.body.content,
                    })
                var user: string[] = [];
                await database().ref('TblRating')
                    .child(req.params.rid).child('Replied').once('value', snap => [
                        snap.forEach(child => {
                            if (child.val().User != decodeToken.uid) {
                                user.push(child.val().User)
                            }
                        })
                    ])
                var tokens: string[] = [];
                for (let i = 0; i < user.length; i++) {
                    await database().ref('TblCustomer').child(user[i]).once('value', (snap) => {
                        if (snap.val().Token != ''
                            && snap.val().Token != undefined) {
                            tokens.push(snap.val().Token)
                        }
                    })
                }
                if (tokens.length != 0) {
                    messaging().sendMulticast({
                        notification: {
                            body: '1 bình luận mới vừa được thêm vào bài viết bạn đang theo dõi',
                            title: 'Thông báo',
                        },
                        data: {
                            type: 'Comment',
                            id: req.params.rid,
                        },
                        tokens: tokens
                    })
                }
                return res.status(200).json({
                    succeed: true,
                    message: 'Đã thêm bình luận'
                });
            }).catch((error) => {
                return res.status(401).json({
                    succeed: false,
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Add new ratings
router.post('/add/:oid', async (req: any, res: any) => {
    const { orderdetail, images } = req.body;
    console.log(orderdetail)
    try {
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

                let rating = 5;
                var comment = ''
                if (orderdetail.Rating != undefined) {
                    rating = orderdetail.Rating;
                }
                if (orderdetail.Comment != undefined) {
                    comment = orderdetail.Comment;
                }
                database().ref('TblRating').once('value', (snapshot) => {
                    var items: any[] = [];
                    snapshot.forEach((child) => {
                        if (child.val().ProductID == orderdetail.ProductID) {
                            items.push(child.val().Rating);
                        }
                    })
                    var rate = rating;
                    for (let i = 0; i < items.length; i++) {
                        rate = rate + items[i];
                    }
                    rate = rate / (items.length + 1);
                    database().ref('TblProduct').child(orderdetail.ProductID).update({
                        Rating: rate,
                    })
                })
                var newId = database().ref('TblRating').push({
                    ProductID: orderdetail.ProductID,
                    Size: orderdetail.Size,
                    Date: today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
                    Time: today.getHours() + ':' + minutes + ':' + second,
                    User: decodeToken.uid,
                    Rating: rating,
                    Comment: comment,
                    OrderId: req.params.oid,
                }).key;
                images.forEach((e: any, index: number) => {
                    database().ref('TblRating')
                        .child(newId as string).child('Images').child('Image' + index)
                        .set(e)
                })
                return res.status(200).json({
                    succeed: true,
                    message: 'Đã thêm bình luận'
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