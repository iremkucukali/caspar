app.controller('indexController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    var url = "https://caspar-stock.herokuapp.com/";
    
    getSellers();
    getSales();
    getCashBox();

    $scope.valMessage = false;
    $scope.totalSales = 0;
    
    function getSellers() {
        $http.get(url + "seller").then(function(resp) {
            if(resp.data) {
                $scope.sellers = resp.data;
                for(var i in $scope.sellers){
                    $scope.sellers[i].move = false;
                    $scope.sellers[i].new = false;
                    $scope.sellers[i].sell = false;
                }
            }
        });
        $scope.obj = {};
    }

    function getSales() {
        $http.get(url + "sale").then(function(resp) {
            if(resp.data) {
                $scope.sales = resp.data;
                for(var i=0; i<$scope.sales.length; i++) {
                    $scope.totalSales += $scope.sales[i].numberOfCopies * $scope.sales[i].price;
                }
            }
        });
    }

    function getCashBox() {
        $http.get(url + "cashBox").then(function(resp) {
            if(resp.data) {
                $scope.cashBoxes = resp.data;
                for(var i in $scope.cashBoxes){
                    $scope.cashBoxes[i].move = false;
                }
            }
        });
    }
    
    $scope.moveFrom = function(seller) {
        $scope.selectedSeller = seller;
        for(var i in $scope.sellers){
            $scope.sellers[i].move = false;
            $scope.sellers[i].new = false;
            $scope.sellers[i].sell = false;
        }
        $scope.selectedSeller.move = true;
        $scope.obj.fromSeller = seller.id;
    };

    $scope.transferMoney = function(cashBox) {
        $scope.selectedCashBox = cashBox;
        for(var i in $scope.cashBoxes){
            $scope.cashBoxes[i].move = false;
        }
        $scope.selectedCashBox.move = true;
        $scope.transfer.fromCashBox = cashBox.id;
    };

    $scope.newFrom = function(seller) {
        $scope.selectedSeller = seller;
        for(var i in $scope.sellers){
            $scope.sellers[i].move = false;
            $scope.sellers[i].new = false;
            $scope.sellers[i].sell = false;
        }
        $scope.selectedSeller.new = true;
        $scope.obj.fromSeller = seller.id;
    };

    $scope.sellFrom = function(seller) {
        $scope.selectedSeller = seller;
        for(var i in $scope.sellers){
            $scope.sellers[i].move = false;
            $scope.sellers[i].new = false;
            $scope.sellers[i].sell = false;
        }
        $scope.selectedSeller.sell = true;
        $scope.transaction = {};
        $scope.transaction.seller_id= $scope.selectedSeller.id;
    };

    $scope.deleteFrom = function(seller) {
        $http.delete(url + "seller/"+seller.id).then(function() {
            getSellers();
        });
    };

    $scope.undoSale = function(sale) {
        $http.put(url + "sale/" + sale.id).then(function() {
            getSales();
            getSellers();
        });
    };

    $scope.transact = function(){
        if(!$scope.valMessage){
            $http.post(url + "sale/", $scope.transaction).then(function(resp) {
                $scope.selectedSeller.sell = false;
                $scope.transaction = {};
                getSales();
                getSellers();
                getCashBox();
            })
        }

    };

    $scope.checkIf = function (numberOfCopies) {
        if(numberOfCopies > $scope.selectedSeller.stock){
            $scope.disableIf ={'cursor':'not-allowed'};
            $scope.valMessage = true;
        }
        else {
            $scope.valMessage = false;
            $scope.disableIf ={};
        }
    }

    $scope.checkIfTransfer = function (amount) {
        if(amount > $scope.selectedCashBox.amount){
            $scope.disableIf ={'cursor':'not-allowed'};
            $scope.valMessage = true;
        }
        else {
            $scope.valMessage = false;
            $scope.disableIf ={};
        }
    }
    
    $scope.changeSelected = function (seller_id) {
        $scope.selectedSeller.sell = false;
        $scope.selectedSeller = $scope.sellers.filter(function (el) {
            return el.id == seller_id;
        })[0];
        $scope.selectedSeller.sell = true;
    }

    $scope.save = function() {
        if(!$scope.valMessage) {
            if ($scope.selectedSeller.move) {
                $http.post(url + "seller/move", $scope.obj).then(function (resp) {
                    getSellers();
                }, function (resp) {
                    if (resp.status == 400) {
                        $window.alert("Transaction Failed!");
                        $scope.selectedSeller.move = false;
                        $scope.selectedSeller = null;
                    }
                })
            }
            else if ($scope.selectedSeller.new) {
                $http.post(url + "seller/bud", $scope.obj).then(function (resp) {
                    getSellers();
                }, function (resp) {
                    if (resp.status == 400) {
                        $window.alert("Transaction Failed!");
                        $scope.selectedSeller.new = false;
                        $scope.selectedSeller = null;
                    }
                })
            }
        }
    }

    $scope.saveTransfer = function() {
        if(!$scope.valMessage) {
            if ($scope.selectedCashBox.move) {
                $http.post(url + "cashBox/move", $scope.transfer).then(function (resp) {
                    getCashBox();
                }, function (resp) {
                    if (resp.status == 400) {
                        $window.alert("Transaction Failed!");
                        $scope.selectedCashBox.move = false;
                        $scope.selectedCashBox = null;
                    }
                })
            }
        }
    }

    $scope.cancel = function(){
        for(var i in $scope.sellers){
            $scope.sellers[i].move = false;
            $scope.sellers[i].new = false;
            $scope.sellers[i].sell = false;
        }
    }

    $scope.cancelTransfer = function(){
        for(var i in $scope.cashBoxes){
            $scope.cashBoxes[i].move = false;
        }
    }

}]);