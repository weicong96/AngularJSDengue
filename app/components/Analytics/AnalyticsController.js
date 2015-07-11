var app = angular.module("dengueApp",["ui.router"]);

app.controller("AnalyticsController",["$scope","$state","Park","Hotspot",function($scope,$state,Park,Hotspot){
        var heatmap;
        $scope.data = [];
        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(1.40242041853575, 103.746683094916),
            mapTypeId: google.maps.MapTypeId.STREET
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
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
        var hotspots = Hotspot.query(function(){
            console.log("Got data ");
            var dataPoints = [];
            for(var i = 0; i < hotspots.length;i++){
                var hotspot = hotspots[i];
                if(hotspot["type"] === "REPORTED"){
                     dataPoints.push({ location : new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]), weight: 1 } );   
                }else if(hotspot["type"] == "CLUSTER"){
                    dataPoints.push({ location : new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]), weight: 3 } );
                    console.log("Cluster");
                }                 
            }
            
            heatmap = new google.maps.visualization.HeatmapLayer({
                data : new google.maps.MVCArray(dataPoints),
                map : map 
            });
            console.log(heatmap);
            //heatmap.setMap(map);
        });
        /*$scope.$on('mapInitialized', function(event, map) {
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
            var hotspots = Hotspot.query(function(){
                console.log("Got data ");
                var dataPoints = [];
                for(var i = 0; i < hotspots.length;i++){
                    var hotspot = hotspots[i];

                    dataPoints.push(new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]));
                }
                $scope.data = dataPoints;
                $scope.mapIntialized = false;
                var jsMap = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data : new google.maps.MVCArray(dataPoints)
                });
                console.log($scope.map);
                heatmap.setMap(map);
            });*/
        
        //Need to change all these to communicate with server instead 
     	/*
        var urls = ["bishanpark.kml","cluster.kml","central_breeding.kml","northwest_breeding.kml", "northeast_breeding.kml","southeast_breeding.kml","southwest_breeding.kml"];
		for(var i = 0; i < urls.length;i++){
			var url = urls[i];
			var reportedCases = new google.maps.KmlLayer({
	     		url : "http://weicong.chickenkiller.com/"+url
	     	});
	     	reportedCases.setMap(map);
		}
});
        */	     	
}]);