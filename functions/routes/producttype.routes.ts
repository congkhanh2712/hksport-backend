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
        var length = 0;
        await database().ref('TblProductType')
            .once('value', (val) => length = val.numChildren())
        var temp = items;
        for (let i = 0; i < temp.length; i++) {
            const length = await ProtypeCheck(temp[i].key)
            if (length == 0) {
                items = items.filter(e => e.key !== temp[i].key)
            }
        }
        return res.status(200).json({
            succeed: true,
            list: items.reverse(),
            length: length,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
async function ProtypeCheck(key: string | null) {
    var length = 0;
    await database().ref('TblProduct')
        .orderByChild('Product_Type').equalTo(key)
        .once('value', snap => {
            length = snap.numChildren();
        })
    return length
}
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
        const { page } = req.query;
        console.log('I am here: ' + page)
        const { categoryId } = req.params;
        if (parseInt(page) != 0) {
            await database().ref('TblProductType')
                .orderByChild('CategoryID').equalTo(categoryId)
                .limitToLast(parseInt(page) * 5).once('value', async (snap) => {
                    snap.forEach(child => {
                        var item = new ProductType(child.key, child.val())
                        items.push(item);
                    })
                    var length = 0;
                    await database().ref('TblProductType')
                        .orderByChild('CategoryID').equalTo(categoryId)
                        .once('value', (val) => length = val.numChildren())
                    var temp = items;
                    for (let i = 0; i < temp.length; i++) {
                        const length = await ProtypeCheck(temp[i].key)
                        if (length == 0) {
                            items = items.filter(e => e.key !== temp[i].key)
                        }
                    }
                    return res.status(200).json({
                        succeed: true,
                        list: items.reverse(),
                        length: length,
                    });
                })
        } else {
            await database().ref('TblProductType')
                .orderByChild('CategoryID').equalTo(categoryId)
                .once('value', (snap) => {
                    snap.forEach(child => {
                        var item = new ProductType(child.key, child.val())
                        items.push(item);
                    })
                })
            return res.status(200).json({
                succeed: true,
                list: items
            });
        }
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
        return res.status(200).json({
            succeed: true,
            list: items
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/app/:categoryId/:brandId', async (req: any, res: any) => {
    try {
        var items: ProductType[] = [];
        const { categoryId, brandId } = req.params;
        await database().ref('TblProductType').once('value').then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (categoryId != 'all') {
                    if (brandId == 'all' && categoryId == childSnapshot.val().CategoryID) {
                        var item = new ProductType(childSnapshot.key, childSnapshot.val())
                        items.push(item);
                    } else {
                        if (brandId != 'all' && categoryId == childSnapshot.val().CategoryID && brandId == childSnapshot.val().BrandID) {
                            var item = new ProductType(childSnapshot.key, childSnapshot.val())
                            items.push(item);
                        }
                    }
                } else {
                    if (brandId == 'all') {
                        var item = new ProductType(childSnapshot.key, childSnapshot.val())
                        items.push(item);
                    } else {
                        if (brandId == childSnapshot.val().BrandID) {
                            var item = new ProductType(childSnapshot.key, childSnapshot.val())
                            items.push(item);
                        }
                    }
                }
            });
        });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;
