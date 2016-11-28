/* globals ejs */

angular.module('parlameterCardCms').controller('CardEditCtrl',function(
    $scope,
    $uibModalInstance,
    cardService,
    card,
    $templateCache,
    $http){

    $scope.card = card;

    $scope.cancel = function(){

        $uibModalInstance.dismiss();

    };

    $scope.cardTypes = cardService.cardTypes;

    $scope.confirm = function(){

        $scope.isSaving = true;

        cardService.update($scope.card._id, $scope.card)
            .then(function(res){

                console.log(res);
                $uibModalInstance.dismiss();

            }).catch(function(res){

            console.log(res);
            $scope.isSaving = false;

        });

    };

    $scope.preview = function(){

        if($scope.card.previewUrl){

            $http.get('partial/embed-container/embed-container.html', {
                cache: $templateCache
            }).then(function(containerEjs) {

                console.log(containerEjs);

                $http.get($scope.card.previewUrl)
                    .then(function(res){

                        var rendered = ejs.render($scope.card.ejs, {
                            data: res.data
                        });

                        var renderedHtml = ejs.render(containerEjs.data, {
                            cardHtml : rendered
                        });

                        var w = window.open();

                        $(w.document.body).html(renderedHtml);

                    })
                    .catch(function(err){

                        console.log(err);

                    });

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
