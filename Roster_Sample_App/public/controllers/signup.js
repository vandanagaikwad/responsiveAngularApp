angular.module('MyApp')
  .controller('SignupCtrl', function($scope, userService) {
    $scope.signup = function() {
      userService.signup({
        name: $scope.displayName,
        email: $scope.email,
        password: $scope.password       
      });
    };
    
    $scope.pageClass = 'fadeZoom'
  });