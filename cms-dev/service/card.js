angular.module('parlameterCardCms').factory('cardService',function($http, NET) {

	var card = {
        save : function(data){

            var promise = $http.post(NET.API_URL+'/card', data);

            promise.then(function(){



            });

            return promise;

        },
        getList:function(){

            var promise = $http.get(NET.API_URL+'/card');

            promise.then(function(){



            });

            return promise;

        }
    };

	return card;
});
