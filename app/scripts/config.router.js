'use strict';
/**
 * Config for the router
 */

angular.module('notes')
        .run(['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }])
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                        .otherwise('/notes');
                $stateProvider
                        .state('signin', {
                            url: '/signin',
                            templateUrl: 'views/signin.html',
                            controller: 'SigninCtrl',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load('scripts/controllers/signin.js');
                                    }
                                ]
                            }
                        })
                        
                        .state('app', {
                            template: '<div ui-view></div>',
                            abstract: true,
                            controller: 'MainCtrl',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load('scripts/controllers/main.js');htt
                                    }
                                ]
                            }
                        })
                        
                        .state('app.notes', {
                            url: "/notes",
                            templateUrl: 'views/notes.html',
                            controller: 'NotesCtrl',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load('scripts/controllers/notes.js');
                                    }
                                ]
                            }
                        });
            }
        ]);


