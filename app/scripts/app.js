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
 * Set below IP to point to RESTHeart
 * 
 * examples
 * 
 * if RESTHeart runs locally:
 * 
 * var RESTHEART_URL = "http://localhost:8080";
 * 
 * if RESTHeart runs in a docker machine container:
 * 
 * var RESTHEART_URL = "http://[DOCKER_MACHINE_IP]:8080";
 * 
 * where DOCKER_MACHINE_IP can be retrived with following command:
 * 
 * $ docker-machine ip default
 */
var RESTHEART_URL = "http://localhost:8080";

angular
    .module('notes', [
        'ui.router',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'oc.lazyLoad',
        'restheart'
    ])

    // lodash
    .factory('_', ['$window',
        function ($window) {
            // place lodash include before angular
            return $window._;
        }
    ])
    .config(function (restheartProvider) {
        restheartProvider.setBaseUrl(RESTHEART_URL + "/rhnedb");
        restheartProvider.setLogicBaseUrl(RESTHEART_URL + "/_logic");
        restheartProvider.onForbidden(
            function () {
                console.log("Forbidden - User Function");
            }
        );
        restheartProvider.onTokenExpired(
            function () {
                console.log("Token Expired - User Function");
            }
        );
        restheartProvider.onUnauthenticated(
            function () {
                console.log("User Unauthenticated, wrong username or password - User Function");
            }
        );
    })