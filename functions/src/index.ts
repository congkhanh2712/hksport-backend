const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors');


admin.initializeApp({
  credential: admin.credential.cert('./src/permissions.json'),
  databaseURL: "https://tlcnproject.firebaseio.com",
  storageBucket: "gs://tlcnproject.appspot.com"
})


const productRouter = require('../routes/products.routes');
const cartRouter = require('../routes/cart.routes');
const authRouter = require('../routes/authentication.routes');
const orderRouter = require('../routes/order.routes');
const voucherRouter = require('../routes/voucher.routes');
const categoryRouter = require('../routes/category.routes');
const competitionRouter = require('../routes/competition.routes');
const producttypeRouter = require('../routes/producttype.routes');
const brandRouter = require('../routes/brand.routes');
const roleRouter = require('../routes/role.routes');
const ratingRouter = require('../routes/rating.routes');
const seenRouter = require('../routes/seen.routes');
const imageRouter = require('../routes/image.routes');
const messageRouter = require('../routes/message.routes');
const notificationRouter = require('../routes/notification.routes');
const mailRouter = require('../routes/mail.routes');




const app = express();
app.use('/api/order', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/voucher', voucherRouter);
app.use('/api/category', categoryRouter);
app.use('/api/competition', competitionRouter);
app.use('/api/producttype', producttypeRouter);
app.use('/api/brand', brandRouter);
app.use('/api/role', roleRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/seen', seenRouter);
app.use('/api/image', imageRouter);
app.use('/api/message', messageRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/mail', mailRouter);
app.use(cors());




exports.app = functions.https.onRequest(app);
