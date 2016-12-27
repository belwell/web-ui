import { units } from '../../components/utils';

angular.module('bridge.page')
.filter('queryNodeIp', function() {
  return function(input, scope) {
    if (!scope.networkAddress) {
      return input;
    }

    return encodeURIComponent(_.split(input, '__NODEIP__').join(scope.networkAddress));
  };
})
.filter('queryNodeName', function() {
  return function(input, scope) {
    if (!scope.nodeName) {
      return input;
    }

    return encodeURIComponent(_.split(input, '__NODENAME__').join(scope.nodeName));
  };
})
.filter('integerLimit', function() {
  return function(input) {
    return parseInt(input, 10);
  };
})
.controller('nodeCtrl', function($scope, $routeParams, k8s) {
  'use strict';

  $scope.nodeName = $routeParams.name;
  $scope.loadError = false;
  $scope.isTrusted = k8s.nodes.isTrusted;

  k8s.nodes.get($routeParams.name)
    .then(function(node) {
      $scope.node = node;
      $scope.memoryLimit = units.dehumanize(node.status.allocatable.memory, 'binaryBytesWithoutB').value;
      $scope.networkAddress = _.find(node.status.addresses, ['type', 'InternalIP']).address;
      $scope.loadError = false;
      $scope.props = {ips: node.status.addresses};
    })
    .catch(function() {
      $scope.node = null;
      $scope.memoryLimit = null;
      $scope.networkAddress = null;
      $scope.loadError = true;
      $scope.props = null;
    });

});