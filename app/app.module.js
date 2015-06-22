var app = angular.module("dengueApp", ["dengueRouter","ngResource"]);
app.constant("API_URL", "http://weicong.chickenkiller.com:3000/");
app.factory("Park",["API_URL","$resource",function(API_URL, $resource){
	return $resource(API_URL+"park/:id", {id : "@_id"}, {
		update:{
			method: "PUT"
		}
	});
}]);
app.factory("Dataset", ["API_URL", "$resource", function(API_URL, $resource){
	return $resource(API_URL+"dataset/:id",{id : "@_id"}, {
	});
}]);
app.factory("Formula", ["API_URL", "$resource", function(API_URL, $resource){
	return $resource(API_URL+"formula/:id",{id : "@_id"}, {
		update:{
			method: "PUT"
		}
	});
}]);
