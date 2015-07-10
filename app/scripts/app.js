'use strict';

/**
 * @ngdoc overview
 * @name notes
 * @description
 * # restheart notes example
 *
 * Main module of the application.
 */

/*
 * The below IP is valid for Boot2Docker only, otherwise it must be:
 * var RESTHEART_URL = "http://localhost:8080";
 */
var RESTHEART_URL = "http://192.168.59.103:8080";

angular
        .module('notes', [
            'ui.router',
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'LocalStorageModule',
            'ngTouch',
            'oc.lazyLoad',
            'restangular',
            'base64'
        ])

        // Restangular service for API calling
        // also handles auth token expiration
        .factory('ApiRestangular', ['Restangular', 'AuthService', '$state', '$stateParams', 'localStorageService',
            function (Restangular, AuthService, $state, $stateParams, localStorageService) {
                return Restangular.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(RESTHEART_URL + "/rhnedb");

                    RestangularConfigurer.setErrorInterceptor(function (response, deferred, responseHandler) {
                        // check if session expired
                        var te = handleTokenExpiration(response);
                        var f = handleForbidden(response);
                        return !(te || f); // if handled --> false
                    });
                    RestangularConfigurer.setRequestInterceptor(function (elem, operation) {
                        AuthService.setAuthHeaderFromLS();
                        return elem;
                    });

                    function handleTokenExpiration(response) {
                        if (response.status === 401 && AuthService.isAuthenticated()) {
                            // UNAUTHORIZED but signed in => auth token expired
                            AuthService.clearAuthInfo();
                            localStorageService.set('redirected', {"why": "expired", "from": $state.$current.toString(), "params": $stateParams});
                            $state.go("signin", {'reload': true});
                            return true; // handled
                        }

                        return false; // not handled
                    }

                    function handleForbidden(response) {
                        if (response.status === 403) {
                            if (AuthService.isAuthenticated()) {
                                localStorageService.set('redirected', {'why': 'forbidden', 'from': $state.$current.toString()});
                                $state.go("404", {}, {'reload': true});
                            } else {
                                $state.go("signin");
                            }

                            return true; // handled
                        }

                        return false; // not handled
                    }
                });
            }])

        // Restangular service for authentication
        .factory('AppLogicRestangular', function (Restangular, localStorageService, $location) {
            return Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
                RestangularConfigurer.setBaseUrl(RESTHEART_URL + "/_logic");
            });
        })

        // lodash
        .factory('_', ['$window',
            function ($window) {
                // place lodash include before angular
                return $window._;
            }
        ])

        .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
                localStorageServiceProvider.setStorageType('sessionStorage');
                localStorageServiceProvider.setPrefix('notes');
            }])

        .config(['RestangularProvider', function ( RestangularProvider) {
                RestangularProvider.setRestangularFields({
                    id: "_id.$oid",
                    etag: "_etag.$oid",
                    selfLink: "_links['self'].href"
                });
                RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                    var extractedData;
                    if (operation === "getList") {
                        if (angular.isDefined(data._embedded['rh:doc'])) {
                            extractedData = data._embedded['rh:doc'];
                        } else if (angular.isDefined(data._embedded['rh:file'])) {
                            extractedData = data._embedded['rh:file'];
                        } else {
                            extractedData = [];
                        }

                        if (angular.isDefined(data._embedded['rh:warnings'])) {
                            extractedData._warnings = data._embedded['rh:warnings'];
                        }

                        extractedData._returned = data._returned;
                        extractedData._size = data._size;
                        extractedData._total_pages = data._total_pages;
                        extractedData._links = data._links;
                    } else {
                        extractedData = data;
                    }

                    //console.debug("**** " + JSON.stringify(extractedData, null, 2));

                    return extractedData;
                });
                RestangularProvider.setDefaultHeaders({'Accept': 'application/hal+json', 'Content-Type': 'application/json', 'No-Auth-Challenge': 'true'});
            }])

        .service('AuthService', function ($base64, $http, localStorageService, _) {
            this.encodeAuthHeader = function (userid, password) {
                return 'Basic ' + $base64.encode(userid + ":" + password);
            };

            this.setAuthHeaderFromLS = function () {
                var token = localStorageService.get('authtoken');
                if (angular.isDefined(token) && token !== null) {
                    $http.defaults.headers.common["Authorization"] = 'Basic ' + localStorageService.get('authtoken');
                }
            };

            this.setAuthHeader = function (userid, password) {
                $http.defaults.headers.common["Authorization"] = 'Basic ' + $base64.encode(userid + ":" + password);
            };

            this.saveAuthInfo = function (userid, password, roles) {
                var header = $base64.encode(userid + ":" + password);
                localStorageService.set('userid', userid);
                localStorageService.set('authtoken', header);
                localStorageService.set('nav', $base64.encode(JSON.stringify(roles)));
                return header;
            };

            this.clearAuthInfo = function () {
                var restheartUrl = localStorageService.get('restheartUrl');
                var redirected = localStorageService.get('redirected');

                localStorageService.clearAll();

                // avoid restheartUrl to be deleted
                localStorageService.set('restheartUrl', restheartUrl);

                // avoid redirected to be deleted
                localStorageService.set('redirected', redirected);

                if (!angular.isUndefined($http) && !angular.isUndefined($http.defaults)) {
                    delete $http.defaults.headers.common["Authorization"];
                }
            };

            this.getSavedAuthHeader = function () {
                return localStorageService.get('authtoken');
            };

            this.getSavedUserid = function () {
                return localStorageService.get('userid');
            };

            this.isAuthenticated = function () {
                var authHeader = this.getSavedAuthHeader(localStorageService);
                return !(angular.isUndefined(authHeader) || authHeader === null);
            };

        });
