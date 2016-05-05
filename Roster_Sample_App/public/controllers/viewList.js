angular.module('MyApp')
  .controller('ViewCtrl', function($scope, $alert, $routeParams, $location, $rootScope, userService, empService, principalService) {
  	
     empService.getEmp( function() {
      $scope.empRoasterList = [];
      $scope.empName;
     	console.log(' *************** viewController ****************' + JSON.stringify($scope.emp));
        
     // };


     // var queryStr = '';
     // $scope.showRoasterList = function (emp) {
     // 	//Auth.getEmpList(queryStr).the
     // 	console.log(' ********** showEmp controller **************');
     // 	Emp.getEmpList(function(emp) {
     // 		console.log(emp);
     // 		$scope.empRoasterList  = emp;

     // 	}).catch(function (err) {
     //        console.log(err);
     //    }).finally(function () {
     //        //listUpdateInProgress = false;
     //        console.log(' ******** finally block **********');
     //    });
     // };

     	
     	console.log('************* get Emp by id ***************' + $scope.emp);
     	//$scope.columns = Object.keys($scope.columnHeader);
     	$scope.pageClass = 'fadeZoom'
     }).then(function (emp) {
     	$scope.emp = emp;
        var username = principalService.getUserName();
     	console.log(' *************** viewController ****************' + JSON.stringify(username));
          for(var i=0; i<emp.data.length; i++)
          {
     		if(emp.data[i].role === 'manager')
            {

                $scope.empRoasterList = emp.data;
            }
            else
            {
                if(emp.data[i].role === 'employee' && username === emp.data[i].empName)
                {
                     $scope.empRoasterList = emp.data;
                }
            }
          }
        $scope.empRoasterList = emp.data;
     		console.log(' *************** viewController for loop ****************' + JSON.stringify($scope.empRoasterList[0]));
     	
     	$scope.showEmpDetails = function (emp) {
	     	//$scope emp = emp;
	     	
	     	$routeParams.name = emp.name;
	     	console.log('############# in show Emp Details ###########' + $routeParams.name);
	     	$location.path('/emp/' + emp._id);

     };
     // $scope.populateEmpList = function () {
     	//$scope.showEmpList(emp);
        
     }).catch(function (err) {
            console.log(err);
        }).finally(function () {
            //listUpdateInProgress = false;
            console.log(' ******** finally block **********');
        });

    

  });