angular.module('parlameterCardCms').factory('requestInterceptor',function(dataService) {

    return {
        request: function($config) {

            console.log(dataService.user);

            if(dataService.user && dataService.user.token && dataService.user.token.value) {
                $config.headers['Authorization'] = dataService.user.token.value;
            }
            return $config;
        }
    };

});