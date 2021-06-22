import { database, auth } from "firebase-admin";

const { Router } = require('express');
const router = Router();

const db = database()

//Get cart
router.get('', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: any[] = [];
                await db.ref('TblCart').child(decodeToken.uid)
                    .orderByChild('Time')
                    .once('value', (snap: any) => {
                        snap.forEach((child: any) => {
                            if (child.key != 'Status') {
                                items.push(child.val())
                            }
                        })
                    })
                return res.status(200).json(items.reverse());
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Add item to cart
router.post('', async (req: any, res: any) => {
    const { Image, ProductID, Name, Price, Size, Quantity } = req.body;
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var nowquantity = 0;
                db.ref('TblCart').child(decodeToken.uid).update({
                    Status: true,
                })
                await db.ref('TblCart').child(decodeToken.uid).child(ProductID + Size).child('Quantity').once('value', (val) => {
                    if (val.val() != null) {
                        nowquantity = val.val();
                    }
                })
                await db.ref('TblCart').child(decodeToken.uid).child(ProductID + Size).set({
                    Image: Image,
                    Name: Name,
                    ProductID: ProductID,
                    Price: parseInt(Price),
                    Quantity: parseInt(Quantity) + nowquantity,
                    Size: Size,
                    Time: database.ServerValue.TIMESTAMP,
                })
                return res.status(200).json({
                    succeed: true,
                    message: "Đã thêm sản phẩm vào giỏ hàng"
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
//Remove Cart
router.delete('', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await db.ref('TblCart').child(decodeToken.uid).set({
                    Status: false,
                })
                return res.status(200).json({
                    succeed: true,
                    message: "Đã xóa giỏ hàng"
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
//Remove item from cart
router.put('', async (req: any, res: any) => {
    try {
        const { pid, size, quantity } = req.body;
        console.log(pid + ' - ' + size + ' - ' + quantity)
        if (quantity == 0) {
            auth().verifyIdToken(req.headers['x-access-token'], true)
                .then(async (decodeToken) => {
                    await db.ref('TblCart').child(decodeToken.uid).child(pid + size).remove();
                    return res.status(200).json({
                        succeed: true,
                        message: "Đã update thành công"
                    });
                }).catch((error) => {
                    return res.status(401).json({
                        code: error.errorInfo.code
                    });
                })
        } else {
            auth().verifyIdToken(req.headers['x-access-token'], true)
                .then(async (decodeToken) => {
                    db.ref('TblCart').child(decodeToken.uid).child(pid + size).update({
                        Quantity: quantity,
			Time: database.ServerValue.TIMESTAMP,
                    });
                    return res.status(200).json({
                        succeed: true,
                        message: "Đã update thành công"
                    });
                }).catch((error) => {
                    return res.status(401).json({
                        code: error.errorInfo.code
                    });
                })
        }
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get user's cart length
router.get('/length', async (req: any, res: any) => {
    var token = '';
    token = req.headers['x-access-token'];
    console.log(req.headers['x-access-token'])
    auth().verifyIdToken(token, true)
        .then(async (decodeToken) => {
            var length = 0;
            await db.ref('TblCart').child(decodeToken.uid).once('value', (snapshot) => {
                if (snapshot.numChildren() - 1 >= 0) {
                    length = snapshot.numChildren() - 1;
                } else {
                    length = 0
                }
            })
            return res.status(200).json({
                succeed: true,
                length: length,
            });
        }).catch((error) => {
            return res.status(401).json({
                code: error.errorInfo.code
            });
        })
})






module.exports = router;