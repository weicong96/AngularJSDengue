var app = angular.module("dengueApp",["ui.router"]);

app.controller("AnalyticsController",["$scope","$state","Park","Hotspot",function($scope,$state,Park,Hotspot){
        
        var polygons = [];
        var circles = [];
        var clusterCircle = [];
        $scope.data = [];
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(1.363477, 103.842495),
            mapTypeId: google.maps.MapTypeId.STREET
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
         var parks = Park.query(function(){
            $scope.parks = parks;
            for(var i = 0 ;i < parks.length;i++){
                var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(parks[i]["lat"], parks[i]["lng"]),
                      map: map,
                      title: "Hello"
                  });
                var infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, "click", (function(marker, i){
                    return function(){
                        var content = "<div id='content'><h3>"+parks[i]["name"]+"</h3><br>Status : "+parks[i]["risk"]+"</div>";
                        infowindow.setContent(content);
                        infowindow.setOptions({maxWidth:200})
                        infowindow.open(map, marker);
                    }
                    _window.open(map, marker);
                })(marker, i));
            }
    });
        var hotspots = Hotspot.query(function(){
            $scope.$watchGroup(["heatmap", "proximity"], function(){
                if($scope.heatmap === true || $scope.proximity === true){
                    var clusterPoints = [];
                    var dataPoints = [];
                    var dataForPolygon = [];
                    var previous = "";
                    var tempArray = [];

                     var radiuses = [150, 300, 450, 600, 750];
                    var parkIndex = 0;
                    for(var i = 0; i < hotspots.length;i++){
                        var hotspot = hotspots[i];
                        var position = new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]);
                        if(hotspot["type"] === "REPORTED"){
                             dataPoints.push({ location : position, weight: 1 } );   
                        }else if(hotspot["type"] == "CLUSTER"){
                            dataPoints.push({ location : position, weight: 3 } );
                            clusterPoints.push(position);
                        }else if(hotspot["type"] == "PARK"){

                            if($scope.proximity === true){
                                var circleColor = ["#00FF00", "#00DD00", "#00AA00","#009900", "#006600"];
                            var centers = [ 
                                [
                                new google.maps.LatLng(1.365746,103.834963),
                                new google.maps.LatLng(1.363172, 103.842484),
                                new google.maps.LatLng(1.361364, 103.848932)
                                ],[
                                new google.maps.LatLng(1.384274, 103.944633),
                                new google.maps.LatLng(1.381045, 103.951618),
                                new google.maps.LatLng(1.388231, 103.938057)]
                                , [
                                new google.maps.LatLng(1.373633, 103.952216),
                                new google.maps.LatLng(1.372281, 103.952591),
                                new google.maps.LatLng(1.370243, 103.952870)
                                ],[
                                new google.maps.LatLng(1.276488, 103.789935),
                                new google.maps.LatLng(1.276215, 103.791038),
                                new google.maps.LatLng(1.275875, 103.792170)
                                ]
                                ];
                            if(parkIndex < 4){
                                for(var i = 0; i < centers[parkIndex].length;i++){
                                    for(var j = 0; j < radiuses.length;j++){
                                        var radius = radiuses[j];
                                        var circle = new google.maps.Circle({
                                            radius : radius,
                                            map : map,
                                            strokeWeight : 0,
                                            fillColor : circleColor[j],
                                            fillOpacity: 0.18,
                                            center : centers[parkIndex][i]
                                        });
                                        clusterCircle.push(circle);
                                    }
                                }
                            }
                        }

                            if(previous != "" && hotspot["name"] === previous){
                                tempArray.push(new google.maps.LatLng(hotspot["feature"]["lat"], hotspot["feature"]["lng"]));
                            }else{
                                if(tempArray.length > 0){
                                    dataForPolygon.push(tempArray);//Push?   
                                }
                                tempArray = [];
                            }
                            previous = hotspot["name"];
                            parkIndex++;
                        }                 
                    }
                    if($scope.proximity === true){
                         var circleColor = ["#FDDBE1", "#FAABE1", "#F88BE1","#F66BE1", "#F55BE1"];
                        for(var i = 0; i < clusterPoints.length;i++){
                            for(var j = 0; j < radiuses.length;j++){
                                var radius = radiuses[j];
                                var circle = new google.maps.Circle({
                                    radius : radius,
                                    map : map,
                                    strokeWeight : 0,
                                    fillColor : circleColor[j],
                                    fillOpacity: 0.1,
                                    center : clusterPoints[i]
                                });
                                clusterCircle.push(circle);
                            }
                        }
                    }
                    if(tempArray.length > 0 ){
                        dataForPolygon.push(tempArray);//Push?   
                    }
                    
                    if($scope.heatmap === true){
                        $scope.heatmapLayer = new google.maps.visualization.HeatmapLayer({
                            data : new google.maps.MVCArray(dataPoints),
                            map : map 
                        });
                    }
                }else{
                    if($scope.heatmapLayer != null){
                        $scope.heatmapLayer.setMap(null);
                        for(var i = 0 ; i < polygons.length;i++){
                            polygons[i].setMap(null);
                        }
                    }
                    if(clusterCircle != null){
                        for(var i =0 ; i < clusterCircle.length;i++){
                            clusterCircle[i].setMap(null);
                        }
                    }
                }
            });
        });	
}]);