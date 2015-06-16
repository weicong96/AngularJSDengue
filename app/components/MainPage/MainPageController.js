var app = angular.module("dengueApp",["ui.router"]);

app.controller("MainPageController",["$scope","$state",function($scope,$state){
    $scope.message = "Hello";

}]);