import { database, auth } from "firebase-admin";
import Message from '../model/class/Message';

const { Router } = require('express');
const router = Router();

//Get a conversation
router.get('', async (req: any, res: any) => {
    const { page } = req.query;
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                var items: Message[] = [];
                var length = 0;
                await database().ref('TblMessage').child(decodeToken.uid).limitToLast(page * 15).once('value', (snap) => {
                    snap.forEach((child) => {
                        items.push(new Message(child.key, child.val()))
                    })
                })
                await database().ref('TblMessage').child(decodeToken.uid).once('value', (snap) => {
                    length = snap.numChildren();
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
//Post a message
router.post('', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblMessage').child(decodeToken.uid).push(req.body)
                return res.status(200).json({
                    succeed: true,
                    message: "Tin nhắn đã được gửi"
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
//Update message status
router.put('/user', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblMessage')
                    .child(decodeToken.uid)
                    .orderByChild('isMe').equalTo(false)
                    .once('value', snap => {
                        snap.forEach((child) => {
                            if (child.key != null) {
                                database().ref('TblMessage')
                                    .child(decodeToken.uid).child(child.key)
                                    .update({ Seen: true })
                            }
                        })
                    })
                return res.status(200).json({
                    succeed: true,
                    message: "Tin nhắn đã được update"
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
router.put('/admin', async (req: any, res: any) => {
    try {
        await database().ref('TblMessage')
            .child(req.body.uid)
            .orderByChild('isMe').equalTo(true)
            .once('value', snap => {
                snap.forEach((child) => {
                    if (child.key != null) {
                        database().ref('TblMessage')
                            .child(req.body.uid).child(child.key)
                            .update({ Seen: true })
                    }
                })
            })
        return res.status(200).json({
            succeed: true,
            message: "Tin nhắn đã được update"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get last message
router.get('/last-message', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                database().ref('TblMessage').child(decodeToken.uid)
                    .limitToLast(1).once('value', snap => {
                        snap.forEach(child => {
                            return res.status(200).json({
                                succeed: true,
                                message: new Message(child.key, child.val())
                            });
                        })
                    })
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