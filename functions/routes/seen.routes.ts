import { database, auth } from "firebase-admin";
import SeenProduct from '../model/class/SeenProduct';

const { Router } = require('express');
const router = Router();
const db = database();

//Add user's seen
router.post('/:pid', async (req: any, res: any) => {
    auth().verifyIdToken(req.headers['x-access-token'], true)
        .then(async (decodeToken) => {
            await db.ref('TblCustomer').child(decodeToken.uid).child('Seen')
                .child(req.params.pid).update(req.body);
        })

    return res.status(200).json({
        succeed: true,
        message: "Đã thêm vào sản phẩm đã xem",
    });
})
//Like or Remove press
router.put('/:pid', async (req: any, res: any) => {
    const { like, remove } = req.body;
    if (like != null) {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await db.ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .child(req.params.pid).update({
                        Liked: like
                    });
                return res.status(200).json({
                    succeed: true,
                    message: "Đã update thành công",
                });
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    }
    if (remove != null) {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await db.ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .child(req.params.pid).update({
                        Remove: remove
                    });
                return res.status(200).json({
                    succeed: true,
                    message: "Đã update thành công",
                });
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    }
})
//Check that user have liked this product or not
router.get('/liked/:pid', async (req: any, res: any) => {
    const { pid } = req.params;
    auth().verifyIdToken(req.headers['x-access-token'], true)
        .then(async (decodeToken) => {
            var seen = false;
            await database().ref('TblCustomer').child(decodeToken.uid).child('Seen').child(pid).once('value', (snapshot) => {
                if (snapshot.val().Liked != undefined) {
                    seen = snapshot.val().Liked;
                }
            })
            return res.status(200).json({
                succeed: true,
                result: seen,
            });
        }).catch((error) => {
            return res.status(401).json({
                code: error.errorInfo.code
            });
        })
})
//Get user's Liked list
router.get('/list/liked', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: SeenProduct[] = [];
                var length = 0;
                await database().ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .orderByChild('Liked').equalTo(true)
                    .limitToLast(parseInt(req.query.page) * 6)
                    .once('value', (snapshot) => {
                        console.log(snapshot.val())
                        snapshot.forEach((child) => {
                            items.push(new SeenProduct(child.key, child.val()));
                        })
                    })
                await database().ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .orderByChild('Liked').equalTo(true)
                    .once('value', (snapshot) => {
                        length = snapshot.numChildren();
                    })
                return res.status(200).json({
                    succeed: true,
                    list: items.reverse(),
                    length: length,
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
//Get user's Seen list
router.get('/list/seen', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: SeenProduct[] = [];
                var length = 0;
                await database().ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .orderByChild('Remove').equalTo(false)
                    .limitToLast(parseInt(req.query.page) * 6)
                    .once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            items.push(new SeenProduct(child.key, child.val()));
                        })
                    })
                await database().ref('TblCustomer').child(decodeToken.uid).child('Seen')
                    .orderByChild('Remove').equalTo(false)
                    .once('value', (snapshot) => {
                        length = snapshot.numChildren();
                    })
                return res.status(200).json({
                    succeed: true,
                    list: items.reverse(),
                    length: length,
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