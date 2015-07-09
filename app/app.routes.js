var app = angular.module("dengueRouter", ["ui.router","oc.lazyLoad"]);

app.config(function($ocLazyLoadProvider, $stateProvider , $urlRouterProvider){
	$ocLazyLoadProvider.config({
		modules : [{
			name : "MainPage",
			files: [
				'app/components/MainPage/MainPageController.js'
			]
		},{
			name : "AddPark",
			files: [
				'app/components/AddPark/AddParkController.js'
			]
		},{
			name : "Analytics",
			files : [
				"app/components/Analytics/AnalyticsController.js"
			]
		},{
			name: "AddFormula",
			files: [
				"app/components/AddFormula/AddFormulaController.js"
			]
		},{
			name : "GetParkInfo",
			files: [
				"../bower_components/Chart.js/Chart.js",
				"bower_components/angular-chart.js/dist/angular-chart.min.js",
				"app/components/GetParkInfo/GetParkInfoController.js"
			]
		}
		]
	}); 
	$stateProvider.state("mainpage", {
		url : "/mainpage", 
		templateUrl : "app/components/MainPage/MainPageView.html",
		controller : "MainPageController",
		resolve  : {
			resolvedFiles : ["$ocLazyLoad",function($ocLazyLoad){
				console.log("Good1");
				return $ocLazyLoad.load("MainPage");
			}]
		}
	})
	.state("addpark", {
		url : "/addpark",
		templateUrl : "app/components/AddPark/AddParkView.html",
		controller: "AddParkController",
		resolve : {
			resolvedFiles : ["$ocLazyLoad", function($ocLazyLoad){
				console.log("Good2");
				return $ocLazyLoad.load("AddPark");
			}]
		}
	})
	.state("viewanalytics",{
		url : "/analytics",
		templateUrl: "app/components/Analytics/AnalyticsView.html",
		controller: "AnalyticsController",
		resolve:{
			resolvedFiles : ["$ocLazyLoad", function($ocLazyLoad){
				return $ocLazyLoad.load("Analytics");
			}]	
		}
	})
	.state("addformula",{
		url : "/addformula",
		templateUrl : "app/components/AddFormula/AddFormulaView.html",
		controller : "AddFormulaController",
		resolve: {
			resolvedFiles : ["$ocLazyLoad", function($ocLazyLoad){
				return $ocLazyLoad.load("AddFormula");
			}]	
		}
	})
	.state("getparkinfo", {
		url : "/getparkinfo/:parkID",
		templateUrl: "app/components/GetParkInfo/GetParkInfoView.html",
		controller: "GetParkInfoController",
		resolve : {
			resolvedFiles : ["$ocLazyLoad" , function($ocLazyLoad){
				return $ocLazyLoad.load("GetParkInfo");
			}]
		}
	})
	;
	$urlRouterProvider.otherwise("/mainpage");
});