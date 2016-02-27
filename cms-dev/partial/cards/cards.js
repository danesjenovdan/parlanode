angular.module('parlameterCardCms').controller('CardsCtrl',function($scope, $uibModal, cards){

    console.log(cards);

    $scope.newCardClick = function(){

        var modalInstance = $uibModal.open({
            animation:true,
            templateUrl: 'partial/card-new/card-new.html',
            controller: 'CardNewCtrl',
            size: 'md'
        });

    };

});
