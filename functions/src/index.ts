const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('./src/permissions.json'),
    databaseURL: "https://tlcnproject.firebaseio.com",
})


const productRouter = require('../routes/products.routes');
const cartRouter = require('../routes/cart.routes');
const authRouter = require('../routes/authentication.routes');
const orderRouter = require('../routes/order.routes');
const voucherRouter = require('../routes/voucher.routes');




const app = express();
app.use('/api/order',orderRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth',authRouter);
app.use('/api/voucher',voucherRouter);



exports.app = functions.https.onRequest(app);
