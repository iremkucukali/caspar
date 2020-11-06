var models = require("../models");
var async = require('async');

module.exports = function (cb) {

    var tasks = [
        function (callback) {
            models.Seller.create({
                name: "Optimist",
                stock: "3000",
                district: "Istanbul",
                email: "optimist@caspar.example.io"
            }).then(function (seller) {
                callback(null, null);
            });
        },
        function (callback) {
            models.Seller.create({
                name: "Brown",
                stock: "1000",
                district: "Istanbul",
                email: "brown@caspar.example.io"
            }).then(function (seller) {
                callback(null, null);
            });
        },
        function (callback) {
            models.CashBox.create({
                name: "Main",
                amount: 0
            }).then(function (cashBox) {
                callback(null, null);
            })
        },
        function (callback) {
            models.CashBox.create({
                name: "Secondary",
                amount: 0
            }).then(function (cashBox) {
                callback(null, null);
            })
        }
    ];

    async.series(tasks, function (err, results) {
        cb();
    });
};
