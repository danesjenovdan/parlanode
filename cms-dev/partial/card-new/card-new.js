/* globals ejs */

angular.module('parlameterCardCms').controller('CardNewCtrl',function($scope, $http, $uibModalInstance, cardService){

    $scope.cancel = function(){

        $uibModalInstance.dismiss();

    };

    $scope.confirm = function(){

        cardService.save($scope.card);

        //$uibModalInstance.dismiss();

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

});
