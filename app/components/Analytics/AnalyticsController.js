var app = angular.module("dengueApp",["ui.router","ngMap"]);

app.controller("AnalyticsController",["$scope","$state",function($scope,$state){
    $scope.message = "Hello";

    $scope.$on('mapInitialized', function(event, map) {
     	console.log(map);

     	var marker = new google.maps.Marker({
     		position : new google.maps.LatLng(1.3000,103.8000),
     		map : map,
     		title: "Hello World"
     	});
    });
}]);