var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.infiniteScroll']);


app.controller('MainCtrl', ['$scope', '$http', '$timeout', '$q', function ($scope, $http, $timeout, $q) {

    var PAGE_SIZE = 50;
    var ITEMS_LEFT_WHEN_REQUEST_NEW_DATA = 20;

    function entriesRangeUrl(start, end) {
        return '/entries?start=' + start + '&end=' + end;
    }

    $scope.gridOptions = {
        infiniteScrollRowsFromEnd: ITEMS_LEFT_WHEN_REQUEST_NEW_DATA,
        infiniteScrollUp: true,
        infiniteScrollDown: true,
        columnDefs: [
            {name: 'name'}
        ],
        data: 'data',
        onRegisterApi: function (gridApi) {
            gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
            $scope.gridApi = gridApi;
        }
    };

    $scope.data = [];

    $scope.getFirstData = function () {
        var promise = $q.defer();
        $http.get(entriesRangeUrl(0, PAGE_SIZE))
            .success(function (data) {
                $scope.data = $scope.data.concat(data);
                promise.resolve();
            });
        return promise.promise;
    };

    $scope.getDataDown = function () {
        var promise = $q.defer();
        var length = $scope.data.length;
        $http.get(entriesRangeUrl(length, length + PAGE_SIZE))
            .success(function (data) {
                var dataLength = data.length;
                if (dataLength > 0) {
                    $scope.gridApi.infiniteScroll.saveScrollPercentage();
                    $scope.data = $scope.data.concat(data);
                }
                $scope.gridApi.infiniteScroll.dataLoaded(false, true)
                    .then(function () {
                        promise.resolve();
                    });
            })
            .error(function (error) {
                $scope.gridApi.infiniteScroll.dataLoaded();
                promise.reject();
            });
        return promise.promise;
    };

    $scope.reset = function () {
        // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
        $scope.gridApi.infiniteScroll.setScrollDirections(false, false);
        $scope.data = [];

        $scope.getFirstData().then(function () {
            $timeout(function () {
                // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                $scope.gridApi.infiniteScroll.resetScroll(true, true);
            });
        });
    };

    $scope.getFirstData().then(function () {
        $timeout(function () {
            // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
            // you need to call resetData once you've loaded your data if you want to enable scroll up,
            // it adjusts the scroll position down one pixel so that we can generate scroll up events
            //$scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, $scope.lastPage < 4);
            $scope.gridApi.infiniteScroll.resetScroll(true, true);
        });
    });

}]);