var app = angular.module("dengueApp",["ui.router"]);

app.controller("AnalyticsController",["$scope","$state","Park","Hotspot",function($scope,$state,Park,Hotspot){
        
        $scope.polygons = [];
        $scope.circles = [];

        $scope.data = [];
        var mapOptions = {
            zoom: 11,
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
            $scope.parks = parks;
            $scope.$watchGroup(["proximity"], function(){
                if($scope.proximity === true){
                    for(var i = 0; i < parks.length; i++){
                        var park = parks[i];

                        var radiuses = [150, 300, 450, 600, 750];
                        var circleColor = ["#0000FF", "#00FF00", "#FF0000","#00FF00", "#000FF0"];
                        for(var j = 0; j < radiuses.length;j++){
                            var radius = radiuses[j];
                            var circle = new google.maps.Circle({
                                radius : radius,
                                map : map,
                                strokeWeight : 0,
                                fillColor : circleColor[j],
                                fillOpacity: 0.15,
                                center : new google.maps.LatLng(park.lat,park.lng)
                            });
                            $scope.circles.push(circle);
                        }
                    }
                }else{
                    for(var i = 0; i < $scope.circles.length; i++){
                        $scope.circles[i].setMap(null);
                    }
                }
            });
        });
        var hotspots = Hotspot.query(function(){
            $scope.$watchGroup(["heatmap"], function(){
                if($scope.heatmap === true){
                    var dataPoints = [];
                    var dataForPolygon = [];
                    var previous = "";
                    var tempArray = [];
                    for(var i = 0; i < hotspots.length;i++){
                        var hotspot = hotspots[i];
                        var position = new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]);
                        if(hotspot["type"] === "REPORTED"){
                             dataPoints.push({ location : position, weight: 1 } );   
                        }else if(hotspot["type"] == "CLUSTER"){
                            dataPoints.push({ location : position, weight: 3 } );
                        }else if(hotspot["type"] == "PARK"){
                            if(previous != "" && hotspot["name"] === previous){
                                tempArray.push(new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]));
                            }else{
                                if(tempArray.length > 0){
                                    dataForPolygon.push(tempArray);//Push?   
                                }
                                tempArray = [];
                            }
                            previous = hotspot["name"];
                        }                 
                    }
                    if(tempArray.length > 0 ){
                        dataForPolygon.push(tempArray);//Push?   
                    }
                    for(var i = 0; i < dataForPolygon.length;i++){
                        var polygon = new google.maps.Polygon({
                            paths : dataForPolygon[i],
                            strokeWeight : 0,
                            fillColor : "#FF0000",
                            fillOpacity : 0.45,
                            map : map
                        });
                        $scope.polygons.push(polygon);
                    }
                    $scope.heatmapLayer = new google.maps.visualization.HeatmapLayer({
                        data : new google.maps.MVCArray(dataPoints),
                        map : map 
                    });
                }else{
                    if($scope.heatmapLayer != null){
                        $scope.heatmapLayer.setMap(null);
                        for(var i = 0 ; i < $scope.polygons.length;i++){
                            $scope.polygons[i].setMap(null);
                        }
                    }
                }
            });
        });	
}]);