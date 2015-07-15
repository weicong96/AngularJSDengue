var app = angular.module("dengueApp", ["chart.js"]);
app.controller("GetParkInfoController", ["$scope", "Data","$stateParams",function($scope,Data,$stateParams){
     //$scope.series = []
     //$scope.labels = []
     //$scope.data = []
     function isNumeric(value){
      return (value==Number(value))?"number":"string";
     }
     $scope.dataset = []
     console.log("getting");
     var results = Data.getParksData({parkid : $stateParams.parkID}, function(){
        var result = results[0];
        console.log("back");
        for(var i = 0; i < result.data.length; i++){
          var series =  [];
          var labels = [];
          var data = [];
          if(isNumeric(result.data[i][0].data) === "string"){
            continue
          }

          previousDate = null;
          for(var j = 0; j < result.data[i].length;j++){//For items belonging to same dataset
            var dataEntry = result.data[i][j];

            data.push(result.data[i][j].data);

            //Check same date here 
            var date = new Date(result.data[i][j].timeCollected).toDateString();
            if(date == previousDate){
              labels.push(result.data[i][j].timeCollected);
            }else{
              labels.push(result.data[i][j].timeCollected.split("T")[1]);
              //labels.push(result.data[i][j].timeCollected);
            }

            previousDate = date;
          }
          series.push(result.data[i][0]["id"]["name"]);
          $scope.dataset.push({series: series, labels : labels, data : [data]});
        }
     });
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
}]);