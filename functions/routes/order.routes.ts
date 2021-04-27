import { database } from "firebase-admin";
import Order from '../model/class/Order';
const { Router } = require('express');
const router = Router();


//Get all user's order
// router.get('/:page', async (req: any, res: any) => {
//     const { page } = req.params;
//     const { status } = req.body;
//     try {
//         var items: any[] = [];
//         await database().ref('TblOrder')
//             .limitToLast(parseInt(page) * 5)
//             .once('value', (data: any) => {
//                 data.forEach((snap: any) => {
//                     if (status.toLowerCase() == 'all') {
//                         let order = new Order(snap.key, snap.val())
//                         items.push(order);
//                     } else {
//                         if (snap.val().Status.toLowerCase() == status.toLowerCase()) {
//                             let order = new Order(snap.key, snap.val())
//                             items.push(order);
//                         }
//                     }
//                 })
//             })
//         return res.status(200).json(items.reverse());
//     } catch (error) {
//         return res.status(500).send(error);
//     }
// })
//Get user's Orders
router.get('/:uid/:page', async (req: any, res: any) => {
    const { uid, page } = req.params;
    const { status } = req.body;
    try {
        var items: any[] = [];
        await database().ref('TblOrder')
            .limitToLast(parseInt(page) * 5)
            .orderByChild('User').equalTo(uid)
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
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get order detail
// router.get('/detail/:id', async (req: any, res: any) => {
//     console.log(req.params.id);
//     try {
//         var items: any = {};
//         await database().ref('TblOrder')
//             .child(req.params.id)
//             .once('value', (data: any) => {
//                 // data.forEach((snap: any) => {
//                 //     if (status.toLowerCase() == 'all') {
//                 //         let order = new Order(snap.key, snap.val())
//                 //         items.push(order);
//                 //     } else {
//                 //         if (snap.val().Status.toLowerCase() == status.toLowerCase()) {
//                 //             let order = new Order(snap.key, snap.val())
//                 //             items.push(order);
//                 //         }
//                 //     }
//                 // })
//                 console.log(data.val())
//                 items = data.val()
//             })
//         return res.status(200).json(items);
//     } catch (error) {
//         return res.status(500).send(error);
//     }
// })
router.get('/:page', async (req: any, res: any) => {
    const { page } = req.params;
    try {
        var items: any = {};
        await database().ref('TblOrder')
            .child(page)
            .once('value', (data: any) => {
                console.log(data.val())
                items = data.val()
            })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})




module.exports = router;