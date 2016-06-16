(function() {
    'use strict';

    //https://github.com/danialfarid/ng-file-upload
    var service = angular.module('sca-product-life', [ ]);
    service.directive('scaProductLifebrain', ['toaster', '$http', '$timeout', 
    function(toaster, $http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                taskid: '=',
                path: '=', //if empty, it will be set to instantce_id / task_id
                jwt: '=',
                conf: '=', //need sca_api set
            }, 
            templateUrl: 'bower_components/sca-product-life/ui/lifebrain.html',
            link: function($scope, element) {
                //nothing to do..
            }
        };
    }]);

    service.directive('scaProductLifeout', ['toaster', '$http', '$timeout', 
    function(toaster, $http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                task: '=',
                jwt: '=',
                conf: '=', //need sca_api set
            }, 
            templateUrl: 'bower_components/sca-product-life/ui/lifeout.html',
            link: function($scope, element) {
                $scope.graphs = [];
                $scope.$watchCollection('task', function(task) {
                    if(!task) return; //task not yet loaded
                    $scope.graphs = [];
                    var dir = task.instance_id+"/"+task._id;
                    if(task.products && task.products[0].type == "soichih/life/out") {
                        for(var id in task.products[0].graphs) {
                            var graph = task.products[0].graphs[id];
                            var path = dir+"/"+graph.filename;
                            $scope.graphs.push({id: id, url: $scope.conf.sca_api+"/resource/download?r="+task.resource_id+"&p="+encodeURI(path)+"&at="+$scope.jwt});
                        }
                    }
                });
            }
        };
    }]);

    //can't quite do the slidedown animation through pure angular/css.. borrowing slideDown from jQuery..
    service.animation('.slide-down', ['$animateCss', function($animateCss) {
        return {
            enter: function(elem, done) {
                $(elem).hide().slideDown("normal", done);
            },
            leave: function(elem, done) {
                $(elem).slideUp("normal", done);
            }
        };
    }]);

    service.filter('bytes', function() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    });

    service.filter('encodeURI', function() {
      return window.encodeURIComponent;
    });
        
    //end of IIFE (immediately-invoked function expression)
})();


