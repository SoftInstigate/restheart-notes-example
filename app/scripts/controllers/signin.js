'use strict';

angular.module('notes')
        .controller('SigninCtrl', ['$scope', '$state', 'AppLogicRestangular', 'AuthService',
            function ($scope, $state, AppLogicRestangular, AuthService) {
                // redirect to notes if already authenticated
                if (AuthService.isAuthenticated()) {
                    $state.go("app.notes");
                    return;
                }
                
                $scope.signin = function () {
                    $scope.authError = null;
                    AuthService.setAuthHeader($scope.user.id, $scope.user.password);
                    AppLogicRestangular.one('roles', $scope.user.id)
                            .get()
                            .then(
                                    function (userRoles) {
                                        var authToken = userRoles.headers('Auth-Token');
                                        if (authToken === null) {
                                            AuthService.clearAuthInfo();
                                            $scope.authError = "Error. Server has not returned the authentication token.";
                                            return;
                                        }

                                        AuthService.saveAuthInfo($scope.user.id, authToken, userRoles.data.roles);
                                        AuthService.setAuthHeader($scope.user.id, authToken);

                                        $state.go("app.notes");
                                    },
                                    function errorCallback(response) {
                                        $scope.authError = "Wrong credentials";
                                        AuthService.clearAuthInfo();
                                    });
                };
            }]);
