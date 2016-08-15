angular.module('parlameterCardCms').controller('LoginCtrl',function(
  $scope,
  authService,
  $state
){

  $scope.user = {
    email:null,
    password:null
  };

  $scope.loginClick = function(){

    authService.login($scope.user.email, $scope.user.password)
      .then(function(user){

        $state.go('app.cards');

      });

  };

});