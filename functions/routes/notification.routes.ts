import { database, auth } from "firebase-admin";
import Notification from '../model/class/Notification';

const { Router } = require('express');
const router = Router();

//Get notification list
router.get('', async (req: any, res: any) => {
    const { page } = req.query;
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: Notification[] = [];
                var length = 0;
                await database().ref('TblNotification')
                    .child(decodeToken.uid)
                    .once('value', (snap) => {
                        length = snap.numChildren();
                    })
                await database().ref('TblNotification')
                    .child(decodeToken.uid).limitToLast(parseInt(page) * 10)
                    .once('value', (snap) => {
                        snap.forEach((child) => {
                            items.push(new Notification(child.key, child.val()))
                        })
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