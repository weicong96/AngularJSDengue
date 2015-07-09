var app = angular.module("dengueApp", ["chart.js"]);
app.controller("GetParkInfoController", ["$scope", "Data","$stateParams",function($scope,Data,$stateParams){
     //$scope.series = []
     //$scope.labels = []
     //$scope.data = []
     function isNumeric(value){
      return (value==Number(value))?"number":"string";
     }
     $scope.dataset = []
     var results = Data.getParksData({parkid : $stateParams.parkID}, function(){
        var result = results[0];
        
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
        /*
        //Loop through the grouped datasets
        for(var i = 0; i < result.data.length;i++){
          var data = []
          //For this dataset, go loop through all and get all the data
          for(var j = 0; j < result.data[i].length;j+=20){
              $scope.labels.push(result.data[i][j].timeCollected);
              data.push(result.data[i][j].data);
          }
          $scope.data.push(data);
        }*/

     });
     //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
     //$scope.series = ['Series A', 'Series B'];
      //$scope.data = [
       // [65, 59, 80, 81, 56, 55, 40],
        //[28, 48, 40, 19, 86, 27, 90]
      //];
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
}]);