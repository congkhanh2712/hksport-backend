import { database } from "firebase-admin";

const { Router } = require('express');
const router = Router();

const db = database()

//Get cart
router.get('/:uid', async (req: any, res: any) => {
    try {
        var items: any[] = [];
        await db.ref('TblCart').child(req.params.uid).once('value', (snap: any) => {
            snap.forEach((child: any) => {
                if (child.key != 'Status') {
                    items.push(child.val())
                }
            })
        })
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Add item to cart
router.post('/:uid', async (req: any, res: any) => {
    const { image, pid, name, price, size, quantity } = req.body;
    try {
        var nowquantity = 0;
        db.ref('TblCart').child(req.params.uid).update({
            Status: true,
        })
        await db.ref('TblCart').child(req.params.uid).child(pid + size).child('Quantity').once('value', (val) => {
            if (val.val() != null) {
                nowquantity = val.val();
            }
        })
        await db.ref('TblCart').child(req.params.uid).child(pid + size).set({
            Image: image,
            Name: name,
            ProductID: pid,
            Price: parseInt(price),
            Quantity: parseInt(quantity) + nowquantity,
            Size: size,
        })
        return res.status(200).json({
            succeed: true,
            message: "Đã thêm sản phẩm vào giỏ hàng"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Remove Cart
router.delete('/:uid', async (req: any, res: any) => {
    try {
        await db.ref('TblCart').child(req.params.uid).set({
            Status: false,
        })
        return res.status(200).json({
            succeed: true,
            message: "Đã xóa giỏ hàng"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})
//Remove item from cart
router.put('/:uid', async (req: any, res: any) => {
    try {
        const { pid, size } = req.body;
        await db.ref('TblCart').child(req.params.uid).child(pid + size).remove();
        return res.status(200).json({
            succeed: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})





module.exports = router;