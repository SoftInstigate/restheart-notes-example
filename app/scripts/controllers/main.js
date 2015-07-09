'use strict';

angular.module('notes')
        .controller('MainCtrl', ['$state', 'AuthService', function ($state, AuthService) {
                // redirect to signin if not authenticated
                if (!AuthService.isAuthenticated()) {
                    $state.go("signin");
                    return;
                }
            }]);
