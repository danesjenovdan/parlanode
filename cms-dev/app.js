angular.module('parlameterCardCms', ['ui.bootstrap','ui.router','ngAnimate']);

angular.module('parlameterCardCms').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app',{

        url:'/',
        abstract:true,
        views:{
            sidebar:{
                templateUrl:'partial/sidebar/sidebar.html',
                controller:'SidebarCtrl'
            },
            mainHeader:{
                templateUrl:'partial/main-header/main-header.html',
                controller:'MainHeaderCtrl'
            }
        }

    });

    $stateProvider.state('app.cards', {
        url:'cards',
        views:{
            'main@':{
                templateUrl: 'partial/cards/cards.html',
                controller:'CardsCtrl'
            }
        },
        resolve:{
            cards:function(cardService){

                return cardService.getList();

            }
        }
    });


    /* Add New States Above */
    $urlRouterProvider.otherwise('/cards');

})
    .constant('NET',{ API_URL:'http://localhost:7004/api' });

angular.module('parlameterCardCms').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
