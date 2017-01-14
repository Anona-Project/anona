/**
 * Created by tonimas on 13/01/17.
 */
angular.module('MainCtrl').controller('packagectrl',['$scope','$location','$rootScope', '$http','$routeParams','uuid2','$timeout', function($scope, $location, $rootScope, $http, $routeParams,uuid2, $timeout){

    $scope.onSuccess = function(data) {
        console.log(data);
        $scope.codeid = data;
    };
    $scope.onError = function(error) {
        console.log(error);
    };
    $scope.onVideoError = function(error) {
        console.log(error);
    };

    }]);