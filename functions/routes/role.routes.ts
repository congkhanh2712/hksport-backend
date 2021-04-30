import { database } from "firebase-admin";
import Role from '../model/class/Role';

const { Router } = require('express');
const router = Router();


router.get('', async (req: any, res: any) => {
    try {
        var items: Role[] = [];
        await database().ref('TblRole').once('value', (snap) => {
            snap.forEach(child => {
                var item = new Role(child.key, child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:id', async (req: any, res: any) => {
    try {
        await database().ref('TblRole').child(req.params.id).once('value', (snap) => {
            var item = new Role(req.params.id, snap.val())
            return res.status(200).json(item);
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})




module.exports = router;