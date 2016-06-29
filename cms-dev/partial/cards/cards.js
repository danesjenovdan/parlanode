/* globals confirm */

angular.module('parlameterCardCms').controller('CardsCtrl',function($scope, $uibModal, cards, cardService){

    $scope.cards = cardService.model.list;

    $scope.newCardClick = function(){

        var modalInstance = $uibModal.open({
            animation:true,
            templateUrl: 'partial/card-new/card-new.html',
            controller: 'CardNewCtrl',
            size: 'md'
        });

    };

    $scope.removeClick = function(id){

        var c = confirm('Are you sure?');

        if(c) {
            cardService.remove(id);
        }

    };

    $scope.editCard = function(card){

        var modalInstance = $uibModal.open({
            animation:true,
            templateUrl: 'partial/card-edit/card-edit.html',
            controller: 'CardEditCtrl',
            size: 'lg',
            resolve:{
                card:function(){
                    return card;
                }
            }
        });

    };

});
