angular.module('notes')
        .controller('NotesCtrl', ['$scope', 'ApiRestangular', 'AuthService', '_', function ($scope, ApiRestangular, AuthService, _) {
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

                    var filter = getFilter($scope.query, AuthService.getSavedUserid());

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
                        date: {'$date': Date.now()},
                        user: AuthService.getSavedUserid()
                    };

                    ApiRestangular.all("notes").post(note).then(function () {
                        $scope.loadNotes(true);
                    });
                };

                $scope.updateNote = function () {
                    if (angular.isUndefined($scope.selected)) {
                        return;
                    }

                    $scope.selected.date = {'$date': Date.now()};

                    $scope.selected.put(null, {"If-Match": $scope.selected._etag.$oid}).then(function (res) {
                        delete dirties[$scope.selected._id.$oid];
                        $scope.loadNotes(true);
                    });
                };

                $scope.getTitle = function (n) {
                    if (angular.isUndefined(n) || angular.isUndefined(n.content) || n.content.length === 0) {
                        return "Untitled";
                    } else {
                        if (n.content.length > 30) {
                            return n.content.substring(0, 30) + "...";
                        } else {
                            return n.content;
                        }
                    }
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
                
                $scope.isAnyDirty = function () {
                    if (angular.isUndefined(dirties)) {
                        return false;
                    }
                    
                    return Object.keys(dirties).length > 0;
                };

                $scope.loadNotes(true);
            }]);

function getFilter(query, userid) {
    if (angular.isDefined(query)) {
        return {'$and': [{'user': userid}, {'content': {$regex: '(?i).*' + query + '.*' }}]};
    } else {
        return {'user': userid};
    }
}