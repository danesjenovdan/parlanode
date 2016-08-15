angular.module('parlameterCardCms').controller('SidebarCtrl',function(
  $scope,
  authService
){

  $scope.logOutClick = function(){

    authService.logOut();

  }

});