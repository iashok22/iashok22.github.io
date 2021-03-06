//Initialize app 
var app = angular.module('groceryListApp',["ngRoute"]);

//Configure route params using angular-route.min.js
app.config(function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: "views/groceryList.html",
			controller: "ListItemController"
		})
		.when("/addItem", {
			templateUrl:"views/addItem.html",
			controller:"ListItemController"
		})
		.when("/editItem/:id", {
			templateUrl:"views/addItem.html",
			controller:"ListItemController"
		})
		/*.otherwise({
			redirectTo: "/"
		})*/
});

//Service to handle functions called from controller
app.service("GroceryService", function(){
	var groceryService = [];

	groceryService.groceryItems = [
		{id: 1, completed: true, itemName:'Milk', date:'2016-10-05'},
		{id: 2, completed: false, itemName:'Curd', date:'2016-10-03'},
		{id: 3, completed: true, itemName:'Ghee', date:'2016-10-06'},
		{id: 4, completed: false, itemName:'Egg', date:'2016-10-01'},
		{id: 5, completed: true, itemName:'Nuts', date:'2016-10-15'}
	];

	groceryService.findById = function(id) {
		for(item in groceryService.groceryItems) {
			if(groceryService.groceryItems[item].id === id) {
				return groceryService.groceryItems[item];
			}
		}
	}

	groceryService.getNewId = function(){

		if(groceryService.newId){
			groceryService.newId++;
			return groceryService.newId;
		} else {
			var maxId = _.max(groceryService.groceryItems, function(entry){return entry.id});
			console.log(maxId);
			groceryService.newId = maxId.id+1;
			return groceryService.newId;
		}
	};

	groceryService.markCompleted = function(entry) {
		entry.completed = !entry.completed;
	};

	groceryService.removeItem = function(entry) {
		var index = groceryService.groceryItems.indexOf(entry);

		groceryService.groceryItems.splice(index, 1);
	};

	groceryService.save = function(entry){

		var updateItem = groceryService.findById(entry.id);
		if(updateItem) {
			updateItem.completed = entry.completed;
			updateItem.itemName = entry.itemName;
			updateItem.date = entry.date;
		} else {
			entry.id = groceryService.getNewId();
			console.log(entry);
			groceryService.groceryItems.push(entry);
		}
	};

	return groceryService;
});

//Simple Controller to list entry on home page
app.controller("HomeController",["$scope","GroceryService",function($scope,GroceryService){
	$scope.appTitle = "Grocery Store";
	$scope.groceryItems = GroceryService.groceryItems;

	$scope.removeItem = function(entry) {
		GroceryService.removeItem(entry);
	}

	$scope.markCompleted = function(entry) {
		GroceryService.markCompleted(entry);
	}
}]);

// Controller which has add/edit and delete operations
app.controller("ListItemController", ["$scope","$routeParams","$location","GroceryService", function($scope,$routeParams,$location,GroceryService){
	
	if(!$routeParams.id){
		$scope.groceryItem = { id:0 , completed: true, itemName: "", date: new Date()};	
	} else {
		$scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
	}
	
	$scope.save = function(){
		GroceryService.save($scope.groceryItem);
		$location.path("/");
	}
}]);

//Custom directive for footer
app.directive("tbFooterText", function(){
	return {
		restrict:"A",
		template:"<span>All Rights Reserved &copy; 2016</span>"
	}
});

//Custom directive for list items
app.directive("tbGroceryItem", function(){
	return {
		restrict: "E",
		templateUrl: "views/groceryItem.html"
	}
});