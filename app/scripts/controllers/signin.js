'use strict';
angular.module('notes')
    .controller('SigninCtrl', ['$scope', '$state', 'RhAuth',
        function ($scope, $state, RhAuth) {

            // redirect to notes if already authenticated
            if (RhAuth.isAuthenticated()) {
                $state.go("app.notes");
                return;
            }


            $scope.signin = function () {

                var promise = RhAuth.signin($scope.user.id, $scope.user.password);

                promise.then(function (response) {
                    console.log(response);
                    if (response) {
                        $state.go("app.notes");
                    }
                    else {
                        $scope.authError = "Wrong credentials";
                    }
                }, function () {
                    $scope.authError = "Error contacting RESTHeart. Is it running at " + RESTHEART_URL + " ?";
                })

            };

        }]);
