import { database } from "firebase-admin";
import Image from '../model/class/Rating';

const { Router } = require('express');
const router = Router();
const db = database()

//Get product's images
router.get('/:pid', async (req: any, res: any) => {
    var items: Image[] = [];
    await db.ref('TblImage')
        .orderByChild('Product_id').equalTo(req.params.pid)
        .once('value', (snapshot) => {
            snapshot.forEach(child => {
                items.push(new Image(child.key, child.val()));
            })
        })
    return res.status(200).json({
        succeed: true,
        list: items,
    });
})
//Get product's images
router.post('', async (req: any, res: any) => {
    try {
        await db.ref('TblImage').push({
            Product_id: req.body.pid,
            Link: req.body.url,
            isRemove: false,
        }).then(() => {
            return res.status(200).json({
                succeed: true,
                message: "Đã thêm hình ảnh"
            });
        }).catch((err) => {
            return res.status(200).json({
                succeed: false,
                message: err
            });
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;