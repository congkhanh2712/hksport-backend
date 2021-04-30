import { database } from "firebase-admin";
import Category from '../model/class/Category';

const { Router } = require('express');
const router = Router();

router.get('', async (req: any, res: any) => {
    try {
        var items: Category[] = [];
        await database().ref('TblCategory').orderByChild('Name').once('value', (snap) => {
            snap.forEach(child => {
                var item = new Category(child.key, child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:page', async (req: any, res: any) => {
    try {
        const { page } = req.parmas;
        var items: Category[] = [];
        await database().ref('TblCategory').orderByChild('Name').limitToLast(page * 3).once('value', (snap) => {
            snap.forEach(child => {
                var item = new Category(child.key, child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.post('', async (req: any, res: any) => {
    try {
        await database().ref('TblCategory').push(req.body);
        return res.status(200).json({
            message: 'Thêm thành công',
            succeed: true,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;