var app = angular.module("dengueApp",["ui.router"]);

app.controller("AddParkController",["$scope","$state","Park",function($scope,$state,Park){
	$scope.park = {};
	$scope.submitForm = function(){
		Park.save($scope.park, function(){
			console.log("Saved");
		});
	}
}]);