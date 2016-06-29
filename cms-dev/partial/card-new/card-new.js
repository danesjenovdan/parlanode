/* globals ejs */

angular.module('parlameterCardCms').controller('CardNewCtrl',function($scope, $http, $uibModalInstance, cardService){

    $scope.card = {};

    $scope.isSaving = false;

    $scope.cancel = function(){

        $uibModalInstance.dismiss();

    };

    $scope.confirm = function(){

        $scope.isSaving = true;

        cardService.save($scope.card)
            .then(function(res){

                $uibModalInstance.dismiss();

        }).catch(function(){

            $scope.isSaving = false;

        });

    };

    $scope.preview = function(){

        if($scope.card.previewUrl){

            $http.get($scope.card.previewUrl)
                .then(function(res){

                    var rendered = ejs.render($scope.card.ejs, {
                        data: res.data
                    });

                    console.log(rendered);

                    var w = window.open();

                    $(w.document.body).html(rendered);

                });

        }

    };

    $scope.isValid = function(){

        var valid = true;


        if($scope.card.dataUrl) {

            var lastChar = $scope.card.dataUrl.slice(-1);

            if (lastChar === '/') {
                valid = false;
            }
        }

        if(!$scope.card.name || !$scope.card.group || !$scope.card.method || !$scope.card.dataUrl || !$scope.card.ejs){
            valid = false;
        }

        return valid;

    };

});
