/**
 * Created by tonim on 05/12/2016.
 */
var MainCtrl = angular.module('MainCtrl', ['ngRoute','ui.bootstrap','angularUUID2']);

MainCtrl.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/index', {
            templateUrl: './views/terminal.html',
            controller: 'terminalctrl'
        })
        .otherwise({
            redirectTo: '/index'
        });
}]);