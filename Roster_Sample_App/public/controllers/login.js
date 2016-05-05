angular.module('MyApp')
  .controller('LoginCtrl', function($scope, userService) {
    $scope.login = function() {
      userService.login({ email: $scope.email, password: $scope.password });
    };
    $scope.facebookLogin = function() {
      userService.facebookLogin();
    };
    $scope.googleLogin = function() {
      userService.googleLogin();
    };
    $scope.pageClass = 'fadeZoom';
  });