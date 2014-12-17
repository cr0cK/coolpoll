(function () {
  'use strict';

  angular.module('coolpoll', [
    'specs',
    'polls',

    'LocalStorageModule',
    'bootstrapLightbox',

    'ngSanitize'
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
    '$scope', '$timeout', '$q', 'Specs', 'Polls', 'User', 'Lightbox',
    function ($scope, $timeout, $q, Specs, Polls, User, Lightbox) {
      $scope.$on('ready', function () {
        $scope.ready = true;

        $scope.specs = Specs.get();
        if (!$scope.specs) {
          $scope.error = 'An error has occurred...';
        } else {
          $scope.graphicsPicked = Polls.getUrls();
        }

        $scope.feedback = Polls.getFeedback();
      });

      $scope.username = User.get();

      if ($scope.username) {
        $scope.loadApp();
      }

      /**
       * Save the username.
       */
      $scope.login = function (username) {
        if (/\.|#|\[|\]/.test(username)) {
          $scope.error = 'Your name can\'t contain ".", "#", "$", "[", or "]"';
        } else {
          $scope.username = username;
          User.set(username);
          $scope.loadApp();
          $scope.error = null;
        }
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
      $scope.togglePick = function (index) {
        if (index === undefined) {
          return;
        }

        if ($scope.isDone()) {
          return;
        }

        var pickedGraphic = $scope.specs.graphics[index];

        // already picked
        if ($scope.isGraphicSelected(index)) {
          _.remove($scope.graphicsPicked,
            function (graphicUrl) {
              return graphicUrl === pickedGraphic.url;
            }
          );
        } else {
          $scope.graphicsPicked.push(pickedGraphic.url);
        }

        Polls.save($scope.graphicsPicked);
      };

      /**
       * Return true if the graphic $index has been selected.
       */
      $scope.isGraphicSelected = function (index) {
        var urls = _.map($scope.specs.graphics, function (graphic) {
          return graphic.url;
        });
        return _.contains($scope.graphicsPicked, urls[index]);
      };

      /**
       * Open graphic in a modal box.
       */
      $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.specs.graphics, index);
      };

      /**
       * Send feedback.
       */
      $scope.sendFeedback = function (feedback) {
        Polls.saveFeedBack(feedback);
        $scope.success = 'Feedback saved!';

        $timeout(function () {
          $scope.success = null;
        }, 3000);
      };
    }
  ]);
})();
