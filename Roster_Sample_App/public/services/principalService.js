angular.module('MyApp')
  .factory('principalService', function($http, $q, $alert) {

    this.currentUser = null;
    return {
      getUserName: function() {
        var self = this;
        var deferred =$q.defer();
        return $http.get('/api/principal')
        console.log(' ********* getEmp success0 **********');
          .success(function(data) {
            console.log(' ********* getEmp success **********' + data[0].role);
            self.currentUser = data;
            
            $alert({
              title: 'Cheers!',
              content: 'You have successfully on get user page.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
            deferred.resolve(self.currentUser != null);
            })
          .error(function(error) {
            delete $window.localStorage.token;
            $alert({
              title: 'Error!',
              content: 'User does not exists on get user.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
            deferred.reject(error);
          });
          return deferred.promise;
      },
      unsubscribe: function(show) {
        return $http.post('/api/unsubscribe', { showId: show._id });
      }
    };
  });