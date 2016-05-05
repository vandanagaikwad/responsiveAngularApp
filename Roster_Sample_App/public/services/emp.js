angular.module('MyApp')
  .factory('empService', function($resource, $http, $location, $alert, $rootScope, $window, $q) {

  	return {
  	//return $http.getEmp('/api/emps');
    //return $resource('/api/emps/:_id');

    getEmp: function(){
    	var deferred =$q.defer();
    	return $http.get('/api/emps')
          .success(function(data) {
          	console.log(' ********* getEmp success **********' + data[0].role);
          	//$location.path('/viewEmpList');
          	
            $alert({
              title: 'Cheers!',
              content: 'You have successfully navigated on list page.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
            deferred.resolve(data);
          	})
          .error(function(error) {
            delete $window.localStorage.token;
            $alert({
              title: 'Error!',
              content: 'User does not exists.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
            deferred.reject(error);
          });
          return deferred.promise;
    },

    getEmpDetails: function(empId){
    	console.log('&&&&&&&&&&&&&&&&&&&&&&&' + JSON.stringify(empId) + empId._id);
    	var deferred =$q.defer();
    	return $http.get('/api/empsbyid',empId)
    	.success(function(data) {
          	console.log(' ********* getEmp success **********' );
          	 deferred.resolve(data);
          	})
          .error(function(error) {
            delete $window.localStorage.token;
            $alert({
              title: 'Error!',
              content: 'User does not exists.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
            deferred.reject(error);
          });
          return deferred.promise;
    }

	};
  });