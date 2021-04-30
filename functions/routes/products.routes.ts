import { database } from "firebase-admin";
import Product from '../model/class/Product';

const { Router } = require('express');
const router = Router();

const db = database()


//Get All Products
router.get('', async (req: any, res: any) => {
    try {
        var items: Product[] = [];
        await db.ref('TblProduct').once('value', (snap: any) => {
            snap.forEach((child: any) => {
                var item = new Product(child.key, child.val());
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})

//Create Product
router.post('', async (req: any, res: any) => {
    try {
        await db.ref('TblProduct').push(req.body);
        return res.status(204).json()
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Product by id
router.get('/:id', (req: any, res: any) => {
    (async () => {
        try {
            db.ref('TblProduct').child(req.params.id).on('value', (val) => {
                var item = new Product(val.key, val.val());
                return res.status(200).json(item);
            })
        } catch (error) {
            return res.status(500).send(error);
        }
    })()
})
//Delete Product
router.delete('/:id', async (req: any, res: any) => {
    try {
        await db.ref('TblProduct').child(req.params.id).remove();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update Product
router.put('/:pid/', async (req: any, res: any) => {
    try {
        db.ref('TblProduct').child(req.params.pid).update(req.body).then(() => {
            return res.status(200).json({
                message: "Update thành công",
                succeed: true
            });
        }).catch((error) => {
            console.log(error)
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Related Product
router.get('/protype/:type_id', async (req: any, res: any) => {
    try {
        var items: Product[] = [];
        await db.ref('TblProduct').orderByChild('Product_Type').equalTo(req.params.type_id).once('value', (snap) => {
            snap.forEach((child) => {
                var item = new Product(child.key, child.val());
                items.push(item);
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Top 5 Product
router.get('/topproduct/:quantity', async (req: any, res: any) => {
    try {
        var items: Product[] = [];
        await db.ref('TblProduct').orderByChild('Sold').limitToLast(parseInt(req.params.quantity)).once('value', (snap: any) => {
            snap.forEach((child: any) => {
                var item = new Product(child.key, child.val());
                items.push(item);
            })
        })
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get All Product in Category
router.get('/category/:category_id', async (req: any, res: any) => {
    try {
        var items: Product[] = [];
        await db.ref('TblProduct').orderByChild('CategoryID').equalTo(req.params.category_id).once('value', (snap: any) => {
            snap.forEach((child: any) => {
                var item = new Product(child.key, child.val());
                items.push(item);
            })
        })
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Product by CompetitionID and Product type
router.get('/:competition_id/:protype/:category_id/:page', async (req: any, res: any) => {
    try {
        const { competition_id, protype, page, category_id } = req.params;
        var items: Product[] = [];
        await db.ref('TblProduct').limitToLast(parseInt(page) * 12).once('value', (snap: any) => {
            snap.forEach((child: any) => {
                if (protype != 'all') {
                    if (competition_id != 'all' &&
                        protype == child.val().Product_Type &&
                        competition_id == child.val().CompetitionID) {
                        var item = new Product(child.key, child.val());
                        items.push(item);
                    } else {
                        if (protype == child.val().Product_Type) {
                            var item = new Product(child.key, child.val());
                            items.push(item)
                        }
                    }
                } else {
                    if (category_id != 'all') {
                        if (competition_id != 'all' &&
                            competition_id == child.val().CompetitionID &&
                            category_id == child.val().CategoryID) {
                            var item = new Product(child.key, child.val());
                            items.push(item)
                        } else {
                            if (competition_id == 'all' &&
                                category_id == child.val().CategoryID) {
                                var item = new Product(child.key, child.val());
                                items.push(item)
                            }
                        }
                    } else {
                        if (competition_id == 'all') {
                            var item = new Product(child.key, child.val());
                            items.push(item)
                        } else {
                            if (competition_id == child.val().CompetitionID) {
                                var item = new Product(child.key, child.val());
                                items.push(item);
                            }
                        }
                    }
                }
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})



module.exports = router;