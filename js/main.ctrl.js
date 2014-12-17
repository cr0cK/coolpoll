(function () {
  'use strict';

  angular.module('coolpoll', [
    'specs',
    'polls'
  ])

  .run([
    '$rootScope', '$q', 'Specs', 'Polls',
    function ($rootScope, $q, Specs, Polls) {
      $rootScope.loading = true;

      Specs.isReady()
        .then(function () {
          return Specs.get();
        })
        .then(function (specs) {
          return Polls.isReady(specs);
        })
        .then(function () {
          $rootScope.$broadcast('ready', true);
        });
    }
  ])

  .controller('MainCtrl', [
    '$scope', '$q', 'Specs', 'Polls',
    function ($scope, $q, Specs, Polls) {
      $scope.$on('ready', function () {
        $scope.loading = false;

        $scope.specs = Specs.get();
        if (!$scope.specs) {
          $scope.error = 'An error has occurred...';
        } else {
          $scope.graphicsPicked = Polls.get();
        }
      });

      /**
       * Return true when all picks are done.
       */
      $scope.isDone = function () {
        if ($scope.loading) {
          return;
        }

        return $scope.graphicsPicked.length === Specs.get().maxPicks;
      };

      /**
       * Save the picked graphics.
       */
      $scope.pick = function (index) {
        if (index === undefined) {
          return;
        }

        if ($scope.isDone()) {
          return;
        }

        var pickedGraphic = $scope.specs.graphics[index];

        // already picked
        if (_.contains($scope.graphicsPicked, pickedGraphic)) {
          return;
        }

        $scope.graphicsPicked.push(pickedGraphic);

        Polls.save($scope.graphicsPicked);
      };

      /**
       * Return true if the graphic $index has been selected.
       */
      $scope.isGraphicSelected = function (index) {
        return _.contains($scope.graphicsPicked, $scope.specs.graphics[index]);
      };
    }
  ]);
})();
