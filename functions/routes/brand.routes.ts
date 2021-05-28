import { database } from "firebase-admin";
import Brand from '../model/class/Brand';

const { Router } = require('express');
const router = Router();


router.get('',async (req: any, res: any) => {
    try {
        var items:Brand[] = [];
        await database().ref('TblBrand')
        .orderByChild('Name')
        .limitToFirst(req.query.page * 4 - 1)
        .once('value', (snap) => {
            snap.forEach(child => {
                var item = new Brand(child.key,child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/all',async (req: any, res: any) => {
    try {
        var items:Brand[] = [];
        await database().ref('TblBrand')
        .orderByChild('Name')
        .once('value', (snap) => {
            snap.forEach(child => {
                var item = new Brand(child.key,child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;