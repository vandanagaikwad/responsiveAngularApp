angular.module('MyApp')
  .controller('AddCtrl', function($scope, $alert, $routeParams, $location, userService, empService, principalService) {

    $scope.submitRoaster = function() {
        userService.submitRoaster({
        empName: $scope.empName,
        empID: $scope.empId,
        managerName: $scope.managerName,
        gender: $scope.gender,
        designation: $scope.designation,
        process: $scope.process,
        mobileNo: $scope.empMobileNo,
        landline: $scope.empLandline,
        address: $scope.empAddress,
        empLocation: $scope.empLocation,
        role: $scope.roles,
        date: $scope.datepicker,
        inTime: $scope.timepicker,
        outTime: $scope.timepicker1
      });
       
    };

       $scope.roleList = [
                { label: 'Employee', name: 'employee' },
                { label: 'Manager', name: 'manager' }
       ];

      var getEmpDetails = function(){
         var empId = $routeParams.empId;

       console.log('********* getEmpDetails **********' + empId);
       empService.getEmpDetails({ _id: empId }, function(emp) {

       }).then(function (emp) {

        console.log('********* getEmpDetails then **********' + JSON.stringify(emp));
        $scope.name = emp.name;
        $scope.lastName = emp.lastName;
        $scope.designation = emp.designation;
       })
       .catch(function (err) {
            console.log(err);
        }).finally(function () {
            //listUpdateInProgress = false;
            console.log(' ******** finally block ********** ');
        });
       
     };

     var init = function () {

      getEmpDetails();

     };
     $scope.cancelRoaster = function () {
          $location.path('/add');
     };

    // init();
   
     // $scope name = emp.name;
     //console.log('************* add controller *********' + emp._id)
     $scope.pageClass = 'fadeZoom'
  });


