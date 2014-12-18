(function () {
  'use strict';

  angular.module('coolpoll')

  .controller('ResultsCtrl', [
    '$scope', 'Specs', 'Polls',
    function ($scope, Specs, Polls) {
      $scope.$on('ready', function () {
        $scope.ready = true;

        $scope.specs = Specs.get();
        if (!$scope.specs) {
          $scope.error = 'An error has occurred...';
        } else {
          $scope.polls = Polls.get();
        }

        var graphicsVotes = {};
        var feedbacks = [];

        angular.forEach($scope.polls, function (data, username) {
          if (!data.urls) {
            return true;
          }

          // count polls
          var urls = JSON.parse(data.urls);

          _.forEach(urls, function (url) {
            if (graphicsVotes[url] === undefined) {
              graphicsVotes[url] = 0;
            }
            graphicsVotes[url]++;
          });

          // get feedbacks
          if (!data.feedback) {
            return true;
          }

          feedbacks.push({
            username: username,
            text: data.feedback
          });
        });

        $scope.graphics = _.map(graphicsVotes, function (polls, url) {
          return {
            url: url,
            polls: polls
          };
        });

        $scope.feedbacks = feedbacks;
      });

      $scope.loadApp();
    }
  ]);
})();
