(function() {
    var module = angular.module('server', []);

    module.controller('server', ['$scope', '$http', function($scope, $http) {
        $scope.settings = {};

        (function refresh() {
            $http.get('/api/serverSettings')
                .success(function(data) {
                    $scope.settings = data;
                    $scope.setError(null);
                })
                .error(function(err) {
                    $scope.setError(err);
                });
        })();

        $scope.keyOnChange = function() {
            if ($scope.settings.key && $scope.settings.key.length > 0 && $scope.settings.cert && $scope.settings.cert.length > 0) {
                $scope.settings.ssl = true;
            }
        };

        $scope.saveSettings = function() {
            $http.post('/api/serverSettings', $scope.settings)
                .success(function() {
                    $scope.setError(null);
                })
                .error(function(err) {
                    $scope.setError(err);
                });
        };
    }]);
}());