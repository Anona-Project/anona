/**
 * Created by tonim on 05/12/2016.
 */
angular.module('MainCtrl').controller('terminalctrl',['$scope','$location','$rootScope','$http','$routeParams','uuid2', function($scope, $location, $rootScope, $http, $routeParams,uuid2){

    $scope.generateUUID = function(){
        $scope.uuid = uuid2.newuuid();
        $scope.guid = uuid2.newguid();
    };
}]);