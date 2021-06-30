import { database, auth } from "firebase-admin";
import User from '../model/class/User';
const { Router } = require('express');
const router = Router();
const firebase = require('firebase');
var fbApp = firebase.default.initializeApp({
    apiKey: "AIzaSyBf-gNwY6RWVHEwGNC5Vlm5_jkqxICT8sk",
    authDomain: "tlcnproject.firebaseapp.com",
    databaseURL: "https://tlcnproject.firebaseio.com",
    projectId: "tlcnproject",
    storageBucket: "tlcnproject.appspot.com",
    messagingSenderId: "471190501995",
    appId: "1:471190501995:web:244886b2981b1c36cc0f2e",
    measurementId: "G-ZRM28DF4CB"
});
const axios = require('axios').default;


//Login
router.post('/login', async (req: any, res: any) => {
    try {
        fbApp.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(async () => {
            return res.status(200).json({
                succeed: true,
                message: 'Đăng nhập thành công',
                user: fbApp.auth().currentUser,
            })
        }).catch(() => {
            return res.status(200).json({
                succeed: false,
                message: "Tên đăng nhập hoặc mật khẩu không đúng"
            });
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.post('/refresh-token', async (req: any, res: any) => {
    try {
        axios({
            method: 'post',
            url: 'https://securetoken.googleapis.com/v1/token',
            params: {
                key: "AIzaSyBf-gNwY6RWVHEwGNC5Vlm5_jkqxICT8sk"
            },
            data: {
                refreshToken: req.body.token,
                grant_type: "refresh_token"
            },
        }).then((response: any) => {
            console.log(response.data);
            return res.status(200).json({
                succeed: true,
                access_token: response.data.access_token
            });
        }).catch((err: any) => {
            return res.status(200).json({
                succeed: false,
                error: err
            });
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Register
router.post('/register', async (req: any, res: any) => {
    const { email, password, name, phone, address, city, location, district, ward, avatar } = req.body
    try {
        fbApp.auth().createUserWithEmailAndPassword(email, password).then(async () => {
            //Set thông tin khách hàng
            await database().ref('TblCustomer').child(fbApp.auth().currentUser.uid).set({
                Name: name,
                Phone_Number: phone,
                Role: '-MOgFiH4LPenx6Kqq0Nu',
                PointAvailable: 0,
                Point: 0,
                Token: '',
                Avatar: avatar,
            })
            //Set địa chỉ khách hàng
            await database().ref('TblCustomer').child(fbApp.auth().currentUser.uid).child('Address').update({
                Detail: address,
                City: city,
                District: district,
                Ward: ward,
                Location: location,
            });
            return res.status(200).json({
                succeed: true,
                message: 'Đăng ký thành công',
                user: fbApp.auth().currentUser,
            })
        }).catch((error: any) => {
            if (error.code === 'auth/email-already-in-use') {
                return res.status(200).json({
                    succeed: false,
                    message: "Email đăng kí đã tồn tại"
                });
            } else {
                return res.status(200).json({
                    succeed: false,
                    message: "Đăng kí không thành công"
                });
            }
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Logout
router.post('/logout', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                auth().revokeRefreshTokens(decodeToken.uid)
                    .then(() => {
                        return res.status(200).json({
                            succeed: true,
                            message: "Đăng xuất thành công",
                        });
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
//Logout
router.post('/refresh-token', async (req: any, res: any) => {
    try {

    } catch (error) {
        return res.status(500).send(error);
    }
})
//Forget Password
router.post('/forget-password', async (req: any, res: any) => {
    try {
        fbApp.auth().sendPasswordResetEmail(req.body.email)
            .then(() => {
                return res.status(200).json({
                    succeed: true,
                    message: "Link đặt lại mật khẩu vừa được gửi tới mail của bạn. Vui lòng kiểm tra!!"
                });
            }).catch((error: any) => {
                return res.status(200).json({
                    succeed: false,
                    message: error.message
                });
            });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Current User
router.get('', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                await database().ref('TblCustomer').child(decodeToken.uid).once('value', async (snap) => {
                    let user = new User(snap.key as string, snap.val());
                    user.email = decodeToken.email;
                    if (snap.val().Role != 'Admin') {
                        await database().ref('TblRole').child(snap.val().Role).once('value', child => {
                            user.rolename = child.val().Name
                            user.color = child.val().Color;
                        })
                    } else {
                        user.rolename = "Admin";
                        user.color = '#FF4732'
                    }
                    await auth().getUser(decodeToken.uid).then(res => {
                        user.createdate = res.metadata.creationTime;
                    })
                    return res.status(200).json(user);
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
//Change Password
router.put('/info/change-password', async (req: any, res: any) => {
    const { currentPass, newPass } = req.body;
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                if (decodeToken.email != undefined && decodeToken.email != newPass) {
                    fbApp.auth().signInWithEmailAndPassword(decodeToken.email, currentPass)
                        .then(() => {
                            fbApp.auth().currentUser.updatePassword(newPass)
                                .then(() => {
                                    return res.status(200).json({
                                        succeed: true,
                                        message: 'Đổi mật khẩu thành công'
                                    });
                                })
                                .catch(() => {
                                    return res.status(200).json({
                                        succeed: false,
                                        message: 'Đổi mật khẩu thật bại'
                                    });
                                })
                        }).catch(() => {
                            return res.status(200).json({
                                succeed: false,
                                message: 'Mật khẩu hiện tại không đúng'
                            });
                        })
                } else {
                    return res.status(200).json({
                        succeed: false,
                        message: 'Vui lòng không đặt mật khẩu giống email đăng nhập'
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update User info
router.put('/info/update', async (req: any, res: any) => {
    try {
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblCustomer').child(decodeToken.uid).update(req.body)
                return res.status(200).json({
                    succeed: true,
                    message: 'Cập nhật thành công'
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
//Update user address
router.put('/info/update-address', async (req: any, res: any) => {
    try {
        const { address, ward, district, city, location } = req.body;
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblCustomer').child(decodeToken.uid).child('Address').update({
                    Detail: address,
                    Ward: ward,
                    District: district,
                    City: city,
                    Location: location,
                })
                return res.status(200).json({
                    succeed: true,
                    message: 'Cập nhật thành công'
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
//Update user's device token
router.put('/info/device-token', async (req: any, res: any) => {
    try {
        const { token } = req.body;
        auth().verifyIdToken(req.headers['x-access-token'], true)
            .then(async (decodeToken) => {
                await database().ref('TblCustomer').child(decodeToken.uid).update({
                    Token: token
                })
                return res.status(200).json({
                    succeed: true,
                    message: 'Cập nhật thành công'
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
//Get User by id
router.get('/:uid', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                var item = {
                    email: '',
                    createdate: '',
                    order: 0,
                    seen: 0,
                    liked: 0,
                };
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    await auth().getUser(req.params.uid).then(res => {
                        item.createdate = res.metadata.creationTime;
                        item.email = res.email as string;
                    })
                    await database().ref('TblCustomer').child(req.params.uid)
                        .child('Seen').once('value', val => {
                            item.seen = val.numChildren();
                        })
                    await database().ref('TblCustomer')
                        .child(req.params.uid).child('Seen')
                        .orderByChild('Liked').equalTo(true)
                        .once('value', val => {
                            item.liked = val.numChildren();
                        })
                    await database().ref('TblOrder')
                        .orderByChild('User').equalTo(req.params.uid)
                        .once('value', val => {
                            item.order = val.numChildren();
                        })
                    return res.status(200).json({
                        succeed: true,
                        information: item,
                    });
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
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
