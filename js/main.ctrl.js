(function () {
  'use strict';

  angular.module('coolpoll', [
    'specs',
    'polls',

    'LocalStorageModule'
  ])

  .config(['localStorageServiceProvider', function (lsProvider) {
    lsProvider.setPrefix('[coolpoll]');
  }])

  .run([
    '$rootScope', '$q', 'Specs', 'Polls',
    function ($rootScope, $q, Specs, Polls) {
      $rootScope.ready = false;

      $rootScope.loadApp = function () {
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
      };
    }
  ])

  .controller('MainCtrl', [
    '$scope', '$q', 'Specs', 'Polls', 'User',
    function ($scope, $q, Specs, Polls, User) {
      $scope.$on('ready', function () {
        $scope.ready = true;

        $scope.specs = Specs.get();
        if (!$scope.specs) {
          $scope.error = 'An error has occurred...';
        } else {
          $scope.graphicsPicked = Polls.get();
        }
      });

      $scope.username = User.get();

      if ($scope.username) {
        $scope.loadApp();
      }

      /**
       * Save the username.
       */
      $scope.login = function (username) {
        $scope.username = username;
        User.set(username);
        $scope.loadApp();
      };

      /**
       * Remove username.
       */
      $scope.logout = function () {
        User.remove();
        $scope.username = undefined;
      };

      /**
       * Return true when all picks are done.
       */
      $scope.isDone = function () {
        if (!$scope.ready) {
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
