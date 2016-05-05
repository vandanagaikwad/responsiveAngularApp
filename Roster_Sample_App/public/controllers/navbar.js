angular.module('MyApp')
  .controller('NavbarCtrl', function($scope, userService) {
    $scope.logout = function() {
      userService.logout();
    };
  });