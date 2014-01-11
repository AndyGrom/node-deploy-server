/**
 * Author: Andrey Gromozdov
 * Date: 19.12.13
 * Time: 0:25
 */

(function (){
    "use strict";

    var module = angular.module('applications', []);

    module.controller('applications', ['$scope', '$http', function($scope, $http) {

        $scope.applications = {};
        $scope.currentApp = null;
        $scope.currentAppName = '';
        $scope.currentAppUrl = '';

        $scope.newApplicationName = '';
        $scope.showNewApplication = false;
        $scope.newApplicationNameValid = false;



        function refresh() {
            $http.get('/api/settings')
                .success(function (data) {
                    $scope.applications = data.applications;
                    $scope.setError(null);
                })
                .error(function(err) {
                    $scope.setError(err);
                });
        }

        refresh();

        $scope.selectApplication = function (name) {
            $scope.currentAppName = name;
            $scope.currentApp = $scope.applications[name];
        };

        $scope.saveSettings = function() {
            $http.post('/api/settings/' + $scope.currentAppName, $scope.currentApp)
                .success(function() {
                    $scope.setError(null);
                })
                .error(function(err) {
                    $scope.setError(err);
                });
        };

        $scope.createApplication = function() {
            $scope.applications[$scope.newApplicationName] = {
                path: '../'
            };
            $scope.selectApplication($scope.newApplicationName);
            $scope.newApplicationName = '';
            $scope.showNewApplication = false;
        };

        $scope.newApplicationNameChange = function () {
            $scope.newApplicationNameValid = false;
            
            var validNameRegexp = /^(\w+)(\w|-)*(\w*)$/;
            if (!validNameRegexp.test($scope.newApplicationName)) {
                return;
            }

            if ($scope.newApplicationName.length < 1) {
                return;
            }

            for (var appName in $scope.applications) {
                if (appName === $scope.newApplicationName) {
                    return;
                }
            }
            $scope.newApplicationNameValid = true;
        };

        $scope.removeApplication = function(name) {
            $http.delete('/api/application/' + name)
                .success(function() {
                    refresh();
                })
                .error(function(err) {
                    $scope.setError(err);
                });
        };

    }]);
}());