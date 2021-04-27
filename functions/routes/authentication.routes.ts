import { database } from "firebase-admin";
const { Router } = require('express');
const router = Router();
const firebase = require('firebase');
const fb = require('firebase/app');
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
//Login
router.post('/login', async (req: any, res: any) => {
    try {
        fbApp.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(() => {
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
//Register
router.post('/register', async (req: any, res: any) => {
    const { email, password, name, phone, address, city, location, district, ward } = req.body
    console.log(req.body)
    try {
        fbApp.auth().createUserWithEmailAndPassword(email, password).then(async () => {
            //Set thông tin khách hàng
            await database().ref('TblCustomer').child(fbApp.auth().currentUser.uid).set({
                Name: name,
                Phone_Number: phone,
                Role: '-MOgFiH4LPenx6Kqq0Nu',
                PointAvailable: 0,
                Point: 0,
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
    console.log(fbApp.auth().currentUser.uid)
    try {
        fbApp.auth().signOut().then(() => {
            return res.status(200).json({
                succeed: true,
                message: 'Đăng xuất thành công'
            })
        }).catch((error: any) => {
            return res.status(200).json({
                succeed: false,
                message: error,
            });
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Current User
router.get('/:uid', async (req: any, res: any) => {
    try {
        var user = {
            name: '',
            phone: '',
            role: '',
            point: 0,
            pointAvailable: 0,
            color: '',
            tab: '',
        }
        await database().ref('TblCustomer').child(req.params.uid).once('value', async (snap) => {
            user.name = snap.val().Name;
            user.phone = snap.val().Phone_Number;
            user.point = snap.val().Point;
            user.pointAvailable = snap.val().PointAvailable;
            user.tab = snap.val().Role;
        })
        await database().ref('TblRole').child(user.tab).once('value', child => {
            user.role = child.val().Name;
            user.color = child.val().Color;
        })
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Change Password
function reauthenticate(email: string, password: string) {
    var user = fbApp.auth().currentUser;
    var cred = fb.default.auth.EmailAuthProvider.credential(email, password);
    return user.reauthenticateWithCredential(cred);
}
router.put('/change-password', async (req: any, res: any) => {
    console.log(fbApp.auth().currentUser.uid)
    const { email, currentPass, newPass } = req.body;
    try {
        reauthenticate(email, currentPass)
            .then(() => {
                fbApp.auth().currentUser.updatePassword(newPass)
                    .then(() => {
                        return res.status(200).json({
                            succeed: true,
                            message: 'Đổi mật khẩu thành công'
                        });
                    })
                    .catch(()=>{
                        return res.status(200).json({
                            succeed: true,
                            message: 'Đổi mật khẩu thật bại'
                        });
                    })
            })
            .catch(() => {
                return res.status(200).json({
                    succeed: true,
                    message: 'Mật khẩu hiện tại không đúng'
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update User info
router.put('/:uid', async (req: any, res: any) => {
    try {
        const { name, phone } = req.body;
        await database().ref('TblCustomer').child(req.params.uid).update({
            Name: name,
            Phone_Number: phone
        })
        return res.status(200).json({
            succeed: true,
            message: 'Cập nhật thành công'
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update user address
router.put('/update-address/:uid', async (req: any, res: any) => {
    try {
        const { address, ward, district, city, location } = req.body;
        await database().ref('TblCustomer').child(req.params.uid).child('Address').update({
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
    } catch (error) {
        return res.status(500).send(error);
    }
})








module.exports = router;
