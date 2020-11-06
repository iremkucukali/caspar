"use strict";

var express = require('express');
var router = express.Router();
var models = require("./models");
var sequelize = require('sequelize');

router.get('/seller/', function(req, res, next) {
    models.Seller.findAll().then(function(sellers) {
        res.json(sellers);
    })
});

router.get('/sale/', function(req, res, next) {
    models.Sale.findAll({
        include: [{
            model: models.Seller,
            as: 'Seller',
            paranoid: false
        }],
        order: [sequelize.literal('Sale.created_at DESC')]
    }).then(function(sellers) {
        res.json(sellers);
    })
});

router.post('/seller', function(req, res, next) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({
            "message": "Bad request."
        });
    }
    delete data.created_at;
    delete data.updated_at;
    delete data.deleted_at;
    models.Seller.create(data).then(function(seller) {
        res.json(seller);
    }).catch(next);
});

router.post('/sale', function(req, res, next) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({
            "message": "Bad request."
        });
    }
    delete data.created_at;
    delete data.updated_at;
    delete data.deleted_at;
    models.Sale.create(data).then(function(sale) {
        models.Seller.findOne({
            where: {
                id: req.body.seller_id
            }
        }).then(function(seller) {
            if(seller.stock>=req.body.numberOfCopies) {
                seller.update({
                    stock: seller.stock - req.body.numberOfCopies
                }).then(function() {
                    models.CashBox.findOne({
                        where: {
                            name: 'Main'
                        }
                    }).then(function(main) {
                        main.update({
                            amount: main.amount + (req.body.numberOfCopies * req.body.price)
                        }).then(function() {
                            res.sendStatus(200);
                        })
                    })
                })
            }
            else {
                res.sendStatus(400);
            }
        })
    }).catch(next);
});

router.post('/seller/move', function(req, res, next) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({
            "message": "Bad request."
        });
    }
    var moving = parseInt(req.body.moving);
    models.Seller.findOne({
        where: {
            id: req.body.fromSeller
        }
    }).then(function(fromSeller) {
        if(fromSeller){
            models.Seller.findOne({
                where: {
                    id: req.body.toSeller
                }
            }).then(function(toSeller) {
                if(toSeller) {
                    fromSeller.update({
                        stock: fromSeller.stock-moving
                    }).then(function() {
                        toSeller.update({
                            stock: toSeller.stock+moving
                        }).then(function() {
                            res.sendStatus(200);
                        })
                    })
                }
                else {
                    return res.status(400).json({
                        "message": "Bad request."
                    });
                }
            })

        }
        else {
            return res.status(400).json({
                "message": "Bad request."
            });
        }
    })
});

router.post('/seller/bud', function(req, res, next) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({
            "message": "Bad request."
        });
    }
    var moving = parseInt(req.body.moving);
    models.Seller.findOne({
        where: {
            id: req.body.fromSeller
        }
    }).then(function(fromSeller) {
        if(fromSeller){
            models.Seller.create({
                name: req.body.name,
                stock: moving,
                district: req.body.district,
                email: req.body.email
            }).then(function() {
                fromSeller.update({
                    stock: fromSeller.stock-moving
                }).then(function() {
                    res.sendStatus(200);
                })
            })
        }
        else {
            return res.status(400).json({
                "message": "Bad request."
            });
        }
    })
});

router.delete('/seller/:sellerId', function(req, res, next) {
    models.Seller.destroy({
        where: {
            id: req.params.sellerId,
            stock: "0"
        }
    }).then(function() {
        res.sendStatus(200);
    })
});

router.put('/sale/undo/:id', function(req, res, next) {
    models.Sale.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(sale) {
        models.Seller.findOne({
            where: {
                id: sale.seller_id
            },
            paranoid: false
        }).then(function (seller) {
            if(seller) {
                seller.setDataValue(deleted_at, null);
                seller.save({
                    paranoid: false
                }).then(function() {
                    seller.update({
                        stock: seller.stock + sale.numberOfCopies
                    }).then(function () {
                        sale.destroy().then(function() {
                            models.CashBox.findOne({
                                where: {
                                    name: 'Main'
                                }
                            }).then(function(main) {
                                main.update({
                                    amount: main.amount - sale.numberOfCopies * sale.price
                                }).then( function() {
                                    res.sendStatus(200);
                                })
                            })
                        })
                    })
                });
            }
            else {
                res.sendStatus(400);
            }
        })
    })
});

router.post('/cashBox/', function(req, res, next) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({
            "message": "Bad request."
        });
    }
    delete data.created_at;
    delete data.updated_at;
    delete data.deleted_at;
    models.CashBox.create(data).then(function(cashBox) {
        res.json(cashBox);
    }).catch(next);
});

router.get('/cashBox', function(req, res, next) {
    models.CashBox.findAll().then(function(cashBoxes) {
        res.json(cashBoxes);
    })
});

module.exports = router;