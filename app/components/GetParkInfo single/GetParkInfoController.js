var app = angular.module("dengueApp", ["googlechart"]);
app.controller("GetParkInfoController", ["$scope", "Data","$stateParams",function($scope,Data,$stateParams){
     //$scope.series = []
     //$scope.labels = []
     //$scope.data = []
     function isNumeric(value){
      return (value==Number(value))?"number":"string";
    }

    var results = Data.getParksData({parkid : $stateParams.parkID}, function(){
        var result = results[0];//Result is array, get the first item
        var parsed = [];
        var dataArray = [];
        var labels = [];
        for(var i =0; i < result.data.length;i++){
          for(var j =0; j < result.data[i].length;j++){

            if(result == null || result.data[i][j] == null || isNumeric(result.data[i][0].data) === "string"){
              continue
            }
            if(labels.indexOf(result.data[i][j]["id"]["name"]) == -1){
              labels.push(result.data[i][j]["id"]["name"]);
            }
            
          }
        }
        for(var i = 0; i < result.data.length; i++){
              if(result == null || result.data[i][0] == null || isNumeric(result.data[i][0].data) === "string"){
                continue
              }
              //Need to implement something to get only common dates
              var date = null;
              var objectArray = [];
              
              for(var j = 0; j < result.data[i].length;j++){//For items belonging to same dataset

                if(result.data[i][j] == null){
                  continue
                }
                //Check same date here 
                date = new Date(result.data[i][j].timeCollected).getTime()/(60 * 60 * 1000);
                date = new Date(parseInt(date) * 60 * 60 * 1000).getTime();
                var found = false
                var foundIndex = labels.indexOf(result.data[i][j]["id"]["name"])


                //Loops through and find something that has the same date
                for(var z = 0; z < dataArray.length; z++){
                  if(dataArray[z]["time"] == date){
                    found = true 
                    //var foundItems = dataArray[z]["items"].indexOf(result.data[i][j].data)
                    var foundItems = -1;
                    for(var findIndex = 0; findIndex < dataArray[z]["items"].length ; findIndex++){
                      if(dataArray[z]["items"]["data"] == result.data[i][j]["data"]){
                        foundItems = findIndex;
                      }
                    }
                    if(foundItems != -1){
                      dataArray[z]["items"].push(result.data[i][j].data);
                      console.log("found");
                      break;
                    }
                  }
                }
                if(!found){
                  dataArray.push({
                    "time" : date,
                    "items" : [result.data[i][j].data]
                  });
                }
              }
              for(var itemIndex = 0; itemIndex < dataArray.length; itemIndex++){
                var data = [];
                data[0] = {"v" : dataArray[itemIndex]["time"]};
                for(var remainingIndex = 1; remainingIndex <= dataArray[itemIndex]["items"].length; remainingIndex++){
                  //console.log(dataArray[itemIndex]["items"][remainingIndex]+" d");
                  data[remainingIndex] = {"v" : dataArray[itemIndex]["items"][remainingIndex-1]};

                }
                parsed.push({"c" : data});
              }
              console.log(parsed);
            }
            var seriesArray = [];
            for(var index = 0; index < labels.length; index++){
              seriesArray.push({ 
                "id" : labels[index],
                "label" : labels[index],
                "type" : "number"
              });
            }
            $scope.chartObject = {
              "type" : "LineChart",
              "displayed" : true,
              "data" : {
                "cols" : seriesArray,
                "rows" : parsed
              },
              "options": {
                "title": "Trends",
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                  "title": "Data",
                  "gridlines": {
                    "count": 10
                  }
                },
                "hAxis": {
                  "title": "Date"
                }
              },
              "formatters": {}
            };
        //$scope.data = {series: seriesArray, labels : commonLabels, data : dataArray};
      });
$scope.onClick = function (points, evt) {
  console.log(points, evt);
};
}]);