/**
 * Author: Andrey Gromozdov
 * Date: 19.12.13
 * Time: 0:25
 */

(function () {
    "use strict";

    var module = angular.module('main', []);

    module.controller('main', ['$scope', function($scope) {
        $scope.error = null;
        $scope.status = {};

        $scope.setError = function(err) {
            $scope.error = err;
        };

    }]);
}());