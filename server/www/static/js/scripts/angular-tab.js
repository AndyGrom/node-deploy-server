(function() {
    var module = angular.module('tabs', []);

    module.directive('tabs', function() {
        return {
            transclude: true,
            scope: {},
            controller: ['$scope', function($scope) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                };

                this.addPane = function(pane) {
                    if (panes.length === 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
            }],
            templateUrl: 'template/tabs.html'
        };
    });
    module.directive('pane', function() {
        return {
            require: '^tabs',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            templateUrl: 'template/pane.html'
        };
    });
}());