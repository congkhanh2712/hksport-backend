import { database, auth } from "firebase-admin";
const { Router } = require('express');
const router = Router();



function returnDay(ngay: string) {
    var d = '';
    var m = '';
    var y = '';
    var q = 1;
    for (let i = 0; i < 3; i++) {
        if (ngay[i] === '/') {
            d = ngay.slice(0, i);
            for (let j = i + 1; j < ngay.length; j++) {
                if (ngay[j] === '/') {
                    m = ngay.slice(i + 1, j);
                    y = ngay.slice(j + 1, ngay.length);
                }
            }
        }
    }
    if (m === '4' || m === '5' || m === '6') {
        q = 2;
    } else if (m === '7' || m === '8' || m === '9') {
        q = 3;
    } else if (m === '10' || m === '11' || m === '12') {
        q = 4;
    }
    return {
        day: parseInt(d),
        month: parseInt(m),
        year: parseInt(y),
        quarter: q,
        time: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime(),
    };
}
router.get('/axes', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        const { year } = req.query;
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result = [{
                        state: 'Cả năm',
                        all: 0,
                        cancel: 0,
                    }, {
                        state: 'Tháng 1',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 2',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 3',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 4',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 5',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 6',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 7',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 8',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 9',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 10',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 11',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 12',
                        all: 0,
                        cancel: 0,
                    }];
                    await database().ref('TblOrder').once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            if (year == returnDay(child.val().OrderDate).year) {
                                result[0].all++;
                                result[returnDay(child.val().OrderDate).month].all++;
                                if (child.val().Status != 'Đã hủy') {
                                    result[0].cancel++;
                                    result[returnDay(child.val().OrderDate).month].cancel++;
                                }
                            }
                        })
                    })
                    return res.status(200).json({
                        succeed: true,
                        result,
                    })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/year', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result = [new Date().getFullYear()];
                    await database().ref('TblOrder').once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            if (!result.includes(returnDay(child.val().OrderDate).year)) {
                                result.push(returnDay(child.val().OrderDate).year);
                            }
                        })
                    })
                    return res.status(200).json({
                        succeed: true,
                        result: result.sort((a, b) => b - a),
                    })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/line', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        const { year } = req.query;
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result = [{
                        state: 'Cả năm',
                        all: 0,
                        cancel: 0,
                    }, {
                        state: 'Tháng 1',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 2',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 3',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 4',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 5',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 6',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 7',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 8',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 9',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 10',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 11',
                        all: 0,
                        cancel: 0,
                    },
                    {
                        state: 'Tháng 12',
                        all: 0,
                        cancel: 0,
                    }]
                    await database().ref('TblOrder').once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            if (year == returnDay(child.val().OrderDate).year && child.val().Status != 'Đã hủy') {
                                result[0].all += child.val().TotalPrice/1000000;
                                result[returnDay(child.val().OrderDate).month].all
                                    += child.val().TotalPrice/1000000;
                            }
                        })
                    })
                    return res.status(200).json({
                        succeed: true,
                        result,
                    })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/pie', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        const { year } = req.query;
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result = [{
                        state: 'Qúy I',
                        value: 0,
                    },
                    {
                        state: 'Qúy II',
                        value: 0,
                    },
                    {
                        state: 'Qúy III',
                        value: 0,
                    },
                    {
                        state: 'Qúy IV',
                        value: 0,
                    }];
                    await database().ref('TblOrder').once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            if (year == returnDay(child.val().OrderDate).year && child.val().Status != 'Đã hủy') {
                                result[returnDay(child.val().OrderDate).quarter - 1].value
                                    += child.val().TotalPrice/1000000;
                            }
                        })
                    })
                    return res.status(200).json({
                        succeed: true,
                        result,
                    })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/bar', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result: {
                        name: '',
                        value: 0,
                        key: '',
                    }[] = [];
                    await database().ref('TblOrder').once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            if (Date.now() - returnDay(child.val().OrderDate).time <= 2629800000) {
                                var items: any[] = [];
                                Object.entries(child.val().OrderDetail).forEach(([key, value]) => {
                                    items.push(value);
                                });
                                items.forEach(item => {
                                    var i = -1;
                                    result.forEach((e, index) => {
                                        if (e.key == item.ProductID) {
                                            i = index;
                                            e.value += item.Quantity;
                                        }
                                    })
                                    if (i == -1) {
                                        result.push({
                                            name: item.Name,
                                            key: item.ProductID,
                                            value: item.Quantity
                                        })
                                    }
                                })
                            }
                        })
                    }).then(() => {
                        return res.status(200).json({
                            succeed: true,
                            result: result.sort((a, b) => b.value - a.value),
                        })
                    })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.get('/rotatebar', async (req: any, res: any) => {
    try {
        var token = '';
        token = req.headers['x-access-token'];
        auth().verifyIdToken(token, true)
            .then(async (decodeToken) => {
                var role = '';
                await database().ref('TblCustomer').child(decodeToken.uid)
                    .child('Role').once('value', val => {
                        role = val.val();
                    })
                if (role == 'Admin') {
                    var result: {
                        name: string,
                        value: number,
                        key: string,
                    }[] = [];
                    await database().ref('TblCustomer')
                        .orderByChild('Point')
                        .once('value', (snapshot) => {
                            snapshot.forEach((child) => {
                                if (child.val().Role != 'Admin') {
                                    result.push({
                                        name:child.val().Name,
                                        value: child.val().Point,
                                        key: child.key as string
                                    })
                                }
                            })
                        }).then(() => {
                            return res.status(200).json({
                                succeed: true,
                                result,
                            })
                        })
                } else {
                    return res.status(403).json({
                        message: "Forbiden"
                    });
                }
            }).catch((error) => {
                return res.status(401).json({
                    code: error.errorInfo.code
                });
            })
    } catch (error) {
        return res.status(500).send(error);
    }
})


module.exports = router;