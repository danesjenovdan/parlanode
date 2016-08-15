angular.module('parlameterCardCms').factory('nedbService',function() {

    var nedbService = {
        db:{},
        init:function(){

            nedbService.db.user = new Nedb({filename:'nodiscord.user', timestampData:true, autoload:true});

            console.log(nedbService);

        },
        user:{
            insert:function(userData){

                return new Promise(function(resolve, reject){

                    nedbService.db.user.remove({}, function(err, num){

                        if(err) {
                            return reject(err);
                        }

                        nedbService.db.user.insert(userData, function(err, doc){

                            if(err) {
                                return reject(err);
                            }
                            resolve(doc);

                        });

                    });

                });

            },
            get: function(){

                return new Promise(function(resolve, reject){

                    nedbService.db.user.find({}).limit(1).exec(function(err, docs){

                        if(err) {
                            return reject(err);
                        }
                        resolve(docs[0]);

                    });

                });

            },
            clear: function(){

                return new Promise(function(resolve, reject) {

                    nedbService.db.user.remove({}, function (err, num) {

                        if(err){
                            return reject(err);
                        }
                        resolve(num);

                    });

                });

            }
        }
    };

    return nedbService;
});