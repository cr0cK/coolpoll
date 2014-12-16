(function () {
  'use strict';

  angular.module('coolpoll', [
    'specs'
  ])

  .controller('MainCtrl', ['$scope', 'Specs', function ($scope, Specs) {
    // read specs
    Specs.get().then(function (data) {
      $scope.specs = data;
      $scope.remainingPicks = data.maxPicks;
    });

    $scope.isDone = function () {
      return $scope.remainingPicks === 0;
    };

    $scope.pick = function (index) {
      if (index === undefined) {
        return;
      }

      if ($scope.remainingPicks <= 0) {
        return;
      }

      if (!$scope.specs.picked) {
        $scope.specs.picked = [];
      }

      if (_.contains($scope.specs.picked, index)) {
        return;
      }

      $scope.remainingPicks--;
      $scope.specs.picked.push(index);
    };
  }]);
})();
