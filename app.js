var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.infiniteScroll']);


app.controller('MainCtrl', ['$scope', '$http', '$timeout', '$q', function ($scope, $http, $timeout, $q) {

    var PAGE_SIZE = 50;
    var ITEMS_LEFT_WHEN_REQUEST_NEW_DATA = 20;
    var MAX_PAGES_TO_SHOW = 10;

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
            gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);
            $scope.gridApi = gridApi;
        }
    };

    $scope.data = [];

    $scope.firstPage = 0;
    $scope.lastPage = 0;

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
        var lastItemIndex = ($scope.lastPage + 1) * PAGE_SIZE;
        $http.get(entriesRangeUrl(lastItemIndex, lastItemIndex + PAGE_SIZE))
            .success(function (data) {
                $scope.lastPage++;
                $scope.gridApi.infiniteScroll.saveScrollPercentage();
                $scope.data = $scope.data.concat(data);
                $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, true)
                    .then(function () {
                        $scope.checkDataLength('up');
                    })
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

    $scope.getDataUp = function () {
        var promise = $q.defer();
        var startIndex = ($scope.firstPage - 1) * PAGE_SIZE;
        if (startIndex < 0) {
            promise.reject();
            return promise.promise;
        }

        $http.get(entriesRangeUrl(startIndex, $scope.firstPage * PAGE_SIZE))
            .success(function (data) {
                $scope.firstPage--;
                $scope.gridApi.infiniteScroll.saveScrollPercentage();
                $scope.data = data.concat($scope.data);
                $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, true)
                    .then(function() {
                        $scope.checkDataLength('down');
                    })
                    .then(function() {
                        promise.resolve();
                    });
            })
            .error(function (error) {
                $scope.gridApi.infiniteScroll.dataLoaded();
                promise.reject();
            });

        return promise.promise;
    };

    $scope.checkDataLength = function (discardDirection) {
        // work out whether we need to discard a page, if so discard from the direction passed in
        if ($scope.lastPage - $scope.firstPage > 3) {
            // we want to remove a page
            $scope.gridApi.infiniteScroll.saveScrollPercentage();

            //if (discardDirection === 'up') {
            //    $scope.data = $scope.data.slice(100);
            //    $scope.firstPage++;
            //    $timeout(function () {
            //         wait for grid to ingest data changes
            //        $scope.gridApi.infiniteScroll.dataRemovedTop($scope.firstPage > 0, $scope.lastPage < 4);
            //    });
            //} else {
            //    $scope.data = $scope.data.slice(0, 400);
            //    $scope.lastPage--;
            //    $timeout(function () {
                    // wait for grid to ingest data changes
                    //$scope.gridApi.infiniteScroll.dataRemovedBottom($scope.firstPage > 0, $scope.lastPage < 4);
                //});
            //}
        }
    };

    $scope.reset = function () {
        $scope.firstPage = 0;
        $scope.lastPage = 0;

        // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
        $scope.gridApi.infiniteScroll.setScrollDirections(false, false);
        $scope.data = [];

        $scope.getFirstData().then(function () {
            $timeout(function () {
                // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, true);
            });
        });
    };

    $scope.getFirstData().then(function () {
        $timeout(function () {
            // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
            // you need to call resetData once you've loaded your data if you want to enable scroll up,
            // it adjusts the scroll position down one pixel so that we can generate scroll up events
            //$scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, $scope.lastPage < 4);
            $scope.gridApi.infiniteScroll.resetScroll($scope.firstPage > 0, true);
        });
    });

}]);