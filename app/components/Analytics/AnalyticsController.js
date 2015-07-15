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
            /*
            for(var i = 0; i < parks.length; i++){
                 var park = parks[i];
                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(park.lat,park.lng),
                    map : map
                }); 
            }
            */
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
                            circles.push(circle);
                        }
                    }
                }else{
                    for(var i = 0; i < circles.length; i++){
                        circles[i].setMap(null);
                    }
                }
            });
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
                    var circleColor = ["#0000FF", "#00FF00", "#FF0000","#00FF00", "#000FF0"];
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

                            var centers = [ 
                                [
                                new google.maps.LatLng(1.365746,103.834963),
                                new google.maps.LatLng(1.363172, 103.842484),
                                new google.maps.LatLng(1.361364, 103.848932)
                                ],[
                                new google.maps.LatLng(1.384274, 103.944633),
                                new google.maps.LatLng(1.381045, 103.951618),
                                new google.maps.LatLng(1.388231, 103.938057)]];
                            if(parkIndex < 1){
                            
                            for(var i = 0; i < centers[parkIndex].length;i++){
                                for(var j = 0; j < radiuses.length;j++){
                                    var radius = radiuses[j];
                                    var circle = new google.maps.Circle({
                                        radius : radius,
                                        map : map,
                                        strokeWeight : 0,
                                        fillColor : circleColor[j],
                                        fillOpacity: 0.15,
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
                        for(var i = 0; i < clusterPoints.length;i++){
                            for(var j = 0; j < radiuses.length;j++){
                                var radius = radiuses[j];
                                var circle = new google.maps.Circle({
                                    radius : radius,
                                    map : map,
                                    strokeWeight : 0,
                                    fillColor : circleColor[j],
                                    fillOpacity: 0.15,
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