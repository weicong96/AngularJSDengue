var app = angular.module("dengueApp",["ui.router","ngMap"]);

app.controller("AnalyticsController",["$scope","$state","Park",function($scope,$state,Park){
    $scope.$on('mapInitialized', function(event, map) {
     	console.log(map);
        var parks = Park.query(function(){
            for(var i = 0; i < parks.length; i++){
                var park = parks[i];
                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(park.lat,park.lng),
                    map : map
                });   
            }
            $scope.parks = parks
        });
        

     	var urls = ["cluster.kml","central_breeding.kml","northwest_breeding.kml", "northeast_breeding.kml","southeast_breeding.kml","southwest_breeding.kml"];
		for(var i = 0; i < urls.length;i++){
			var url = urls[i];
			var reportedCases = new google.maps.KmlLayer({
	     		url : "http://weicong.chickenkiller.com:8080/"+url
	     	});
	     	reportedCases.setMap(map);
		}	     	

	     	
    });
}]);