/* globals alert */

angular.module('parlameterCardCms').factory('cardService',function($http, NET) {

	var service = {
        model:{
            list:[],
            item:null
        },
        save : function(data){

            var promise = $http.post(NET.API_URL+'/card', data);

            promise.then(function(res){

                console.log(res);

                if(res.status === 200) {
                    service.model.list.push(res.data);
                }else{
                    alert('There was a problem');
                }

            })
                .catch(function(err){
                    console.log(err);
                    if(err.status === 409){
                        alert('A card with the same group and method was found');
                    }

                });

            return promise;

        },
        /**
         *
         * @param id
         * @param data
         * @returns {HttpPromise}
         */
        update:function(id, data){

            console.log(id);

            var promise = $http.put(NET.API_URL+'/card/'+id, data);

            promise.then(function(res){



                });

            return promise;

        },
        getList:function(){

            var promise = $http.get(NET.API_URL+'/card');

            promise.then(function(res){

                service.model.list = res.data;

            });

            return promise;

        },
        remove:function(id){

            var promise = $http.delete(NET.API_URL+'/card/'+id);

            promise.then(function(res){

                angular.forEach(service.model.list, function(card, index){

                    if(card._id === res.data._id){
                        service.model.list.splice(index,1);
                    }

                });

            });

            return promise;

        }
    };

	return service;
});
