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
                /*

                load_task();
                var t = null;

                function load_task() {
                    $http.get($scope.conf.sca_api+"/task/"+$scope.taskid)
                    .then(function(res) {
                        var task = res.data;
                        if(!task.resource_id) {
                            //task doesn't have resource_id.. probably hasn't run yet.. reload later
                            t = $timeout(load_task, 1000);
                            
                        } else {
                            //we have resource! now display!
                            $scope.resourceid = task.resource_id;
                            $scope.path = $scope.path || task.instance_id+"/"+task._id;
                            load_files();
                        }
                    }, function(res) {
                        if(res.data && res.data.message) toaster.error(res.data.message);
                        else toaster.error(res.statusText);
                    });
                }

                function load_files() {
                    $http.get($scope.conf.sca_api+"/resource/ls", {
                        params: {
                            resource_id: $scope.resourceid,
                            path: $scope.path,
                        }
                    })
                    .then(function(res) {
                        $scope.files = res.data.files;
                        $scope.files.forEach(function(file) {
                            file.path = $scope.path+"/"+file.filename;
                        });
                    }, function(res) {
                        if(res.data && res.data.message) toaster.error(res.data.message);
                        else toaster.error(res.statusText);
                    });
                }
                $scope.$on("$destroy", function(event) {
                    if(t) $timeout.cancel(t);
                });
                */
            }
        };
    }]);

    service.directive('scaProductLifeout', ['toaster', '$http', '$timeout', 
    function(toaster, $http, $timeout) {
        return {
            restrict: 'E',
            scope: {
                task: '=',
                //path: '=', //if empty, it will be set to instantce_id / task_id
                jwt: '=',
                conf: '=', //need sca_api set
            }, 
            templateUrl: 'bower_components/sca-product-life/ui/lifeout.html',
            link: function($scope, element) {
                $scope.graphs = [];
                $scope.$watch('task', function(task) {
                    if(!task) return; //task not yet loaded
                    $scope.graphs = [];
                    var dir = task.instance_id+"/"+task._id;
                    if(task.products && task.products[0].type == "life/out") {
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


