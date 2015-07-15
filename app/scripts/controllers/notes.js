angular.module('notes')
        .controller('NotesCtrl', ['$scope', 'ApiRestangular', '_', function ($scope, ApiRestangular, _) {
                $scope.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];
                $scope.selected;
                var dirties = {};

                $scope.selectNote = function (note) {
                    $scope.selected = note;
                };

                $scope.notes;

                $scope.loadNotes = function (selectFirst) {
                    $scope.isLoading = true;

                    var apiOptions = {
                        pagesize: 50,
                        page: 1,
                        count: true,
                        sort_by: "-date"
                    };

                    var filter = getFilter($scope.query);

                    if (angular.isDefined(filter)) {
                        apiOptions.filter = filter;
                    }

                    ApiRestangular.all('notes').getList(apiOptions).then(function (result) {
                        $scope.notes = result;
                        $scope.isLoading = false;
                        if (angular.isDefined(selectFirst) && selectFirst) {
                            $scope.selected = $scope.notes[0];
                        }
                    });
                };

                $scope.$watch('query', function (newValue, oldValue) {
                    $scope.loadNotes();
                }, true);

                $scope.createNote = function () {
                    var note = {
                        content: 'New note',
                        color: $scope.colors[Math.floor((Math.random() * 3))],
                        date: Date.now()
                    };

                    ApiRestangular.all("notes").post(note).then(function () {
                        $scope.loadNotes(true);
                    });
                };

                $scope.updateNote = function () {
                    if (angular.isUndefined($scope.selected)) {
                        return;
                    }

                    $scope.selected.date = Date.now();

                    $scope.selected.put(null, {"If-Match": $scope.selected._etag.$oid}).then(function (res) {
                        dirties[$scope.selected._id.$oid] = false;
                        $scope.loadNotes(true);
                    });
                };

                $scope.deleteNote = function () {
                    ApiRestangular.one("notes", $scope.selected._id.$oid).remove(null, {"If-Match": $scope.selected._etag.$oid}).then(function () {
                        $scope.loadNotes(true);
                    });
                };

                $scope.setDirty = function () {
                    if (angular.isDefined($scope.selected)) {
                        dirties[$scope.selected._id.$oid] = true;
                    }
                };

                $scope.isDirty = function (note) {
                    if (angular.isUndefined(note) || angular.isUndefined(dirties[note._id.$oid])) {
                        return false;
                    } else
                        return dirties[note._id.$oid];
                };

                $scope.loadNotes();
            }]);

function getFilter(search) {
    if (angular.isDefined(search)) {
        return {'content': {$regex: '(?i)^.*' + search + '.*'}};
    }
}

function patchLibraryMaterial($scope, $log, toaster, material, data, retryOnConflict, noToasterOnSuccess) {
    if (angular.isUndefined(noToasterOnSuccess)) {
        noToasterOnSuccess = false;
    }

    material.patch(data).then(function () {
        // refresh data (including etag)
        $scope.loadMaterials($scope.tableState);

        if (angular.isDefined(toaster) && toaster !== null && !noToasterOnSuccess)
            toaster.pop('success', "Yeah", "Material updated.");
    }, function (response) {
        // reset data
        var updatedMaterialPromise = material.get();

        $scope.loadMaterials($scope.tableState);

        if (response.status === 412) {
            $log.warn("ETag does not match (precondition failed 412) on patching material " + material._id + ", retring " + retryOnConflict + " times");
        }

        if (response.status === 412 && angular.isNumber(retryOnConflict) && retryOnConflict > 0) {
            updatedMaterialPromise.then(function (updatedMaterial) {
                patchLibraryMaterial($scope, $log, toaster, updatedMaterial, data, retryOnConflict - 1, noToasterOnSuccess);
            });
        }
        else if (angular.isDefined(toaster) && toaster !== null) {
            var errMsg = "Error: please try again.";
            errMsg = errMsg + (angular.isDefined(response.message) ? " " + response.message : "");
            errMsg = errMsg + " (http response code: " + response.status + ")";
            toaster.pop('error', "Urgh", errMsg);
            $log.error("error patching material " + material._id + "; data:" + JSON.stringify(data) + "; response: " + JSON.stringify(response));
        }
    });
}