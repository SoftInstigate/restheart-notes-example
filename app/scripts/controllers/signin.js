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

                    if (angular.isUndefined($scope.user) || angular.isUndefined($scope.user.password)) {
                        $scope.authError = "Please provide your username and password.";
                        return;
                    }

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
                                        if (response.status === 401 || response.status === 403) {
                                            $scope.authError = "Wrong credentials";
                                        } else {
                                            $scope.authError = "Error contacting RESTHeart. Is it running at " + RESTHEART_URL + " ?";
                                        }

                                        AuthService.clearAuthInfo();
                                    });
                };
            }]);
