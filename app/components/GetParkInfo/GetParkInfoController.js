var app = angular.module("dengueApp", ["chart.js"]);
app.controller("GetParkInfoController", ["$scope", "Data","$stateParams",function($scope,Data,$stateParams){
     //$scope.series = []
     //$scope.labels = []
     //$scope.data = []
     function isNumeric(value){
      return (value==Number(value))?"number":"string";
    }
    var doughnutData = [];
    var doughnutLabel = [];
    var results = Data.getParksData({parkid : $stateParams.parkID}, function(){
      var result = results[0];

      //Below here is other things 
      var series =  [];
      var labels = [];
      var dataArray = [];
      var labelsCount = [];
      var minMaxArray = [];
      for(var i = 0; i < result.data.length; i++){
        var data = [];
        if(isNumeric(result.data[i][0].data) === "string" || result.data[i][0]["id"]["name"] == "Humidity" || result.data[i][0]["id"]["name"] == "Current Temperature"){
          if(isNumeric(result.data[i][0].data) === "string"){
            doughnutData.push(result.data[i][0].data);
          }
          if(doughnutData.indexOf(result.data[i][0].data) > -1)
            var indexData = doughnutLabel[doughnutData.indexOf(result.data[i][0].data)];
            if(indexData == null || indexData == 0)
              doughnutLabel[doughnutData.indexOf(result.data[i][0].data)] = 0;
            else
              doughnutLabel[doughnutData.indexOf(result.data[i][0].data)] += 1;
              console.log("enter here");
          continue
        }

        previousDate = null;
        for(var j = 0; j < result.data[i].length;j++){//For items belonging to same dataset
          var dataEntry = result.data[i][j];

          data.push(result.data[i][j].data);

          var date = new Date(parseInt(new Date(result.data[i][j].timeCollected).getTime()/ (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)).getTime();

          var timeCollectedIndex =labels.indexOf(result.data[i][j].timeCollected);
          if(timeCollectedIndex == -1){
            labels.push(result.data[i][j].timeCollected);
            labelsCount.push(1);
          }else{
            labelsCount[timeCollectedIndex]+=1;
          }

          previousDate = date;
        }

        var max = Math.max.apply(null, data) * 1.10;
        var min = Math.min.apply(null, data) * 0.90;
        var diff = max - min; 
        for(var k = 0; k < data.length;k++){
          var _percentDiff = ((data[k] - min)/diff)*100;
          data[k] = _percentDiff
        }
        dataArray.push(data);
        series.push(result.data[i][0]["id"]["name"]);
      }
      console.log(labelsCount);
      console.log(labels);
      var validLabels = [];
      for(var i = 0; i < labelsCount.length;i++){
        if(labelsCount[i] == 2){
          validLabels.push(labels[i]);
        }
      }

      $scope.data = {series: series, labels : validLabels, data : dataArray};
    });
$scope.doughnutLabel = doughnutLabel;
$scope.doughnutData = doughnutData;
$scope.onClick = function (points, evt) {
  console.log(points, evt);
};
}]);