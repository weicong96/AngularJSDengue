var app = angular.module("dengueApp",[]);

app.controller("AddFormulaController", ["$scope","API_URL","Dataset","Formula",function($scope,API_URL,Dataset,Formula){
	$scope.addConditions = function(formula){
	
		var statuses = ["Low", "Mild", "High"];
		var nextIndex = formula.statuses.length;
		if(nextIndex <= statuses.length){
			formula.statuses.push({"patterns" : [
				{compare : "",
				 dataset : "",
				 frequency : 0,
				 occurences : 0,
				 value : 0
				},
			], statusValue : statuses[nextIndex]});
		}
	}
	$scope.addRow = function(status){
		status.patterns.push ({compare : "",
				 id : "",
				 frequency : 0,
				 occurences : 0,
				 value : 0
				});
	}
	$scope.addFormula = function(){
		console.log("Form submitted");
		var formula = $scope.formula
		console.log(formula)
		for(var i = 0;i < formula.statuses.length; i ++){
			var status = formula.statuses[i];
			for(var j = 0; j < status.patterns.length; j ++){
				var pattern = status.patterns[j];
				if(pattern.newDataset != null){
					pattern.dataset = pattern.newDataset
					delete pattern.newDataset
				}
				if(pattern.newCompare != null){
					pattern.compare = pattern.newCompare
					delete pattern.newCompare
				}
			}
		}
		console.log(formula)
		Formula.update(formula,function(){
			console.log("Updated")	
		})
	}
	
	var formula = Formula.get({"id" : "using"}, function(){
		$scope.formula = formula
	});
	var datasets = Dataset.query(function(){
		console.log(datasets);
		$scope.datasets = datasets
	});

}]);