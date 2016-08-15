angular.module('parlameterCardCms').factory('authService', function (
  $http,
  NET,
  dataService,
  nedbService,
  $state
) {

  var authService = {

    /**
     * Login function
     * @param email
     * @param password
     */
    login: function (email, password) {

      return $http.post(NET.API_URL + '/login', {email: email, password: password})
        .then(function (res) {

          return nedbService.user.insert(res.data)
            .then(function(doc){

              dataService.user = doc;
              console.log(doc);

            })
            .catch(function(err){

              console.log(err);

            });

        });

    },

    isLoggedIn: function(){

      return nedbService.user.get()
        .then(function(doc){

          if(doc) {

            dataService.user = doc;

            console.log('Is logged in');

            return $http.post(NET.API_URL + '/checkLogin', {})
              .catch(function () {

                $state.go('login');

              });

          }else{

            $state.go('login');

          }

        });

    },

    logOut: function(){

      return nedbService.user.clear()
        .then(function(){

          $state.go('login');

        });

    }
  };

  return authService;
});