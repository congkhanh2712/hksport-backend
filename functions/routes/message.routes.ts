import { database, auth, messaging } from "firebase-admin";
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
                if (page != 0) {
                    await database().ref('TblMessage').child(decodeToken.uid).limitToLast(page * 15).once('value', (snap) => {
                        snap.forEach((child) => {
                            items.push(new Message(child.key, child.val()))
                        })
                    })
                } else {
                    await database().ref('TblMessage').child(decodeToken.uid).once('value', (snap) => {
                        snap.forEach((child) => {
                            items.push(new Message(child.key, child.val()))
                        })
                    })
                }
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
//Post a message (user)
router.post('/user', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblMessage').child(decodeToken.uid).push({
                    Message: req.body.message,
                    Time: Date.now(),
                    isMe: true,
                    Seen: false,
                })
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
//Update message status (user)
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
//Post a message (admin)
router.post('/admin', async (req: any, res: any) => {
    try {
        await database().ref('TblMessage').child(req.body.uid).push({
            Message: req.body.message,
            Time: Date.now(),
            isMe: false,
            Seen: false,
        })
        var token = '';
        await database().ref('TblCustomer').child(req.body.uid)
            .once('value', (snap) => {
                if (snap.val().Token != ''
                    && snap.val().Token != undefined) {
                    token = snap.val().Token;
                }
            })
        if (token != '') {
            messaging().send({
                notification: {
                    body: 'HK Sport: ' + req.body.message,
                    title: 'Tin nhắn mới',
                },
                data: {
                    type: 'Message',
                    id: '',
                },
                token: token
            })
        }
        return res.status(200).json({
            succeed: true,
            message: "Tin nhắn đã được gửi"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update message status (admin)
router.put('/admin', async (req: any, res: any) => {
    try {
        await database().ref('TblMessage')
            .child(req.params.uid)
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
                        if (snap.numChildren() != 0) {
                            snap.forEach(child => {
                                return res.status(200).json({
                                    succeed: true,
                                    message: new Message(child.key, child.val())
                                });
                            })
                        } else {
                            return res.status(200).json({
                                succeed: true,
                                message: null
                            });
                        }
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