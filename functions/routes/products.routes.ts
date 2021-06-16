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
        var size;
        if (isNaN(parseInt(req.body.size)) == true) {
            size = req.body.size;
        } else {
            size = parseInt(req.body.size);
        }
        await db.ref('TblProduct').push({
            BrandID: req.body.brand,
            CategoryID: req.body.category,
            Color: req.body.color,
            CompetitionID: req.body.competition,
            Description: req.body.description,
            Image: req.body.image,
            Material: req.body.material,
            Name: req.body.name,
            Price: parseInt(req.body.price),
            Product_Type: req.body.type,
            Rating: 0,
            Size: size,
            Sold: 0,
            Source: req.body.source,
        }).then((id) => {
            return res.status(200).json({
                succeed: true,
                message: "Thêm sản phẩm thành công",
                key: id.key
            })
        }).catch(err => {
            return res.status(200).json({
                succeed: false,
                message: err
            })
        })
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get Product by id
router.get('/:id', (req: any, res: any) => {
    (async () => {
        try {
            db.ref('TblProduct').child(req.params.id).once('value', (val) => {
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
router.put('/:pid', async (req: any, res: any) => {
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
router.get('/protype/:type_id/:page', async (req: any, res: any) => {
    try {
        var items: Product[] = [];
        const { type_id, page } = req.params;
        await db.ref('TblProduct')
            .orderByChild('Product_Type').equalTo(type_id)
            .limitToLast(parseInt(page) * 4).once('value', (snap) => {
                snap.forEach((child) => {
                    var item = new Product(child.key, child.val());
                    items.push(item);
                })
            })
        return res.status(200).json(items.reverse());
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
        res.setHeader('Access-Control-Allow-Origin', '*')
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
        return res.status(200).json(items.reverse());
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get tblproducts length
router.get('/product/length', async (req: any, res: any) => {
    try {
        var length = 0;
        await db.ref('TblProduct').once('value', (snapshot) => {
            length = snapshot.numChildren();
        })
        return res.status(200).json({
            succeed: true,
            length: length,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Update sold property and quantity property of products (when user cancel order)
router.put('', async (req: any, res: any) => {
    try {
        const { orderdetail, type } = req.body;
        if (parseInt(type) == 1) {
            for (let i = 0; i < orderdetail.length; i++) {
                var sold = 0
                await database().ref('TblProduct').child(orderdetail[i].ProductID).child('Sold').once('value', data => {
                    sold = data.val()
                });
                database().ref('TblProduct').child(orderdetail[i].ProductID).update({
                    Sold: sold + orderdetail[i].Quantity
                })
                var nowquantity = 0
                await database().ref('TblProduct')
                    .child(orderdetail[i].ProductID).child('Size').child(orderdetail[i].Size)
                    .once('value', data => {
                        nowquantity = data.val();
                    })
                database().ref('TblProduct').
                    child(orderdetail[i].ProductID).child('Size').child(orderdetail[i].Size).
                    set(nowquantity - orderdetail[i].Quantity);
            }
        } else {
            for (let i = 0; i < orderdetail.length; i++) {
                var sold = 0
                await database().ref('TblProduct').child(orderdetail[i].ProductID).child('Sold').once('value', data => {
                    sold = data.val()
                });
                database().ref('TblProduct').child(orderdetail[i].ProductID).update({
                    Sold: sold - orderdetail[i].Quantity
                })
                var nowquantity = 0
                await database().ref('TblProduct')
                    .child(orderdetail[i].ProductID).child('Size').child(orderdetail[i].Size)
                    .once('value', data => {
                        nowquantity = data.val();
                    })
                database().ref('TblProduct').
                    child(orderdetail[i].ProductID).child('Size').child(orderdetail[i].Size).
                    set(nowquantity + orderdetail[i].Quantity);
            }
            return res.status(200).json({
                succeed: true,
                message: "Update thành công"
            });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get color list
router.get('/list/colors', async (req: any, res: any) => {
    try {
        var colors: any[] = [];
        await database().ref('TblProduct').once('value', snapshot => {
            snapshot.forEach(child => {
                if (child.val().Color != undefined
                    && colors.indexOf(child.val().Color.toLowerCase()) == -1) {
                    if (colors.length < req.query.page * 4 - 1 || req.query.page == 0) {
                        colors.push(child.val().Color.toLowerCase())
                    }
                }
            })
        })
        return res.status(200).json({
            succeed: true,
            list: colors,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Get material list
router.get('/list/materials', async (req: any, res: any) => {
    try {
        var materials: any[] = [];
        await database().ref('TblProduct').once('value', snapshot => {
            snapshot.forEach(child => {
                if (child.val().Material != undefined
                    && materials.indexOf(child.val().Material.toLowerCase()) == -1) {
                    if (materials.length < req.query.page * 4 - 1 || req.query.page == 0) {
                        materials.push(child.val().Material.toLowerCase())
                    }
                }
            })
        })
        return res.status(200).json({
            succeed: true,
            list: materials,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})





module.exports = router;