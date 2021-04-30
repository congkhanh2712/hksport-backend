import {  database } from "firebase-admin";
import Competition from '../model/class/Competition';

const { Router } = require('express');
const router = Router();

router.get('',async (req: any, res: any) => {
    try {
        var items:Competition[] = [];
        await database().ref('TblCompetition').once('value', (snap) => {
            snap.forEach(child => {
                var item = new Competition(child.key,child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})

module.exports = router;