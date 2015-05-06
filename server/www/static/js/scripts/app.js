/**
 * Author: Andrey Gromozdov
 * Date: 19.12.13
 * Time: 0:24
 */

(function (){
    "use strict";

    var app = angular.module('app', ['ngRoute', 'main', 'applications', 'server', 'tabs', 'json']);

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/applications', {
                    templateUrl: 'template/applications.html',
                    controller: 'applications'
                })
                .when('/server', {
                    templateUrl: 'template/server.html',
                    controller: 'server'
                }).when('/deploy', {
                    templateUrl: 'template/deploy.html'
                }).otherwise({ redirectTo: '/' });
        }]);
}());