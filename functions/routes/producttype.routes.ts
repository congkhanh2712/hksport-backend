import { database } from "firebase-admin";
import ProductType from '../model/class/ProductType';

const { Router } = require('express');
const router = Router();

router.get('', async (req: any, res: any) => {
    try {
        var items: ProductType[] = [];
        await database().ref('TblProductType').once('value', (snap) => {
            snap.forEach(child => {
                var item = new ProductType(child.key, child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:page', async (req: any, res: any) => {
    try {
        const { page } = req.params;
        var items: ProductType[] = [];
        await database().ref('TblProductType').limitToLast(page * 3).once('value', (snap) => {
            snap.forEach(child => {
                var item = new ProductType(child.key, child.val())
                items.push(item);
            })
        })
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:page/:cid', async (req: any, res: any) => {
    try {
        const { page, cid } = req.params;
        var items: ProductType[] = [];
        await database().ref('TblProductType')
            .orderByChild('CategoryID').equalTo(cid)
            .limitToLast(page * 3).once('value', (snap) => {
                snap.forEach(child => {
                    var item = new ProductType(child.key, child.val())
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
        await database().ref('TblProductType').push(req.body);
        return res.status(200).json({
            message: 'Thêm thành công',
            succeed: true,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:categoryId', async (req: any, res: any) => {
    try {
        var items: ProductType[] = [];
        await database().ref('TblProductType')
            .orderByChild('CategoryID').equalTo(req.params.categoryId)
            .once('value', (snap) => {
                snap.forEach(child => {
                    var item = new ProductType(child.key, child.val())
                    items.push(item);
                })
            })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/:categoryId/:brandId', async (req: any, res: any) => {
    try {
        var items: ProductType[] = [];
        await database().ref('TblProductType')
            .orderByChild('CategoryID').equalTo(req.params.categoryId)
            .once('value', (snap) => {
                snap.forEach(child => {
                    if (child.val().BrandID == req.params.brandId
                        || child.val().BrandID == '') {
                        var item = new ProductType(child.key, child.val())
                        items.push(item);
                    }
                })
            })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;
