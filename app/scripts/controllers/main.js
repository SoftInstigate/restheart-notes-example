'use strict';

angular.module('notes')
        .controller('MainCtrl', ['$state', 'RhAuth', function ($state, RhAuth) {
                // redirect to signin if not authenticated
                if (!RhAuth.isAuthenticated()) {
                    $state.go("signin");
                    return;
                }
            }]);
