/**
 * Created by tonim on 05/12/2016.
 */
angular.module('MainCtrl').controller('terminalctrl',['$scope','$location','$rootScope','$http','$routeParams','uuid2', function($scope, $location, $rootScope, $http, $routeParams,uuid2){

    //Data treatment FUNCTIONS
    function convertToHex(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    }

    function hexToAscii(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    //-----------------------------


    //Blind signature FUNCTIONS---

    function encryptPubKeyRemote(m,e,n){
        console.log('Encrypt with remote PubKey');
        return m.modPow(e,n);
    }

    function decryptPubKeyRemote (signed,e,n){
        return signed.modPow(e,n);
    }

    function blindMsg (id,random,e,n){
        return  (id.multiply(random.modPow(e,n))).mod(n);
    }
    //-----------------------------



    $scope.issueAmount = function(){
        $http.get('/anonabank/e-coincertificate').success(function(response){

            var n = response.EcoinPublicKey.n;
            console.log(n);
            var e = response.EcoinPublicKey.e;
            console.log(e);
            var rand = bigInt.randBetween(0, n);
            console.log("Random: "+rand);

            $scope.ecoins = [];
            for(i=0; i<$scope.amount; i++){

                var UUID =  uuid2.newuuid();
                console.log("UUID: "+UUID.toString());
                var UUIDBIG = bigInt(convertToHex(UUID),16);
                var blindMessage = blindMsg(UUIDBIG,rand,e,n);
                $scope.ecoins.push({BlindCoinID:blindMessage.toString(16)});
            }


            $http.post('/anonabank/issue', $scope.ecoins)
                .success(function(response){
                var ecoins = [];
                var info = response.Ecoins;
                for(var signedID in info){
                    if (info.hasOwnProperty(signedID)) {
                        var blind = info[signedID].signed;
                        var blindBIG = bigInt(blind, 16);
                        var idsigned = (blindBIG.multiply(rand.modInv(n))).mod(n);
                        var id_ascii = hexToAscii((decryptPubKeyRemote(idsigned,e,n)).toString(16));

                        var date = new Date().toLocaleString();

                        ecoins.push({ID_signed: idsigned.toString(16),ID:id_ascii, amount: 1, issuer:"ANONA-BANK", issue_date:date, URLcheck:"URL PARA COMPROBAR SI LA MONEDA ESTA GASTADA", URLcert:"localhost:3000/anonabank/e-coincertificate" });
                    }
                }
                console.log(ecoins);
            });
        });
    };
}]);