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
        }

        var graphicsVotes = {};
        var feedbacks = [];

        angular.forEach(Polls.get(), function (data, username) {
          if (!data.urls) {
            return true;
          }

          // count votes
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

        $scope.graphics = _.map(graphicsVotes, function (votes, url) {
          return {
            url: url,
            votes: votes
          };
        });

        $scope.feedbacks = feedbacks;
        $scope.nbPeople = _(Polls.get()).keys().filter(function (v) {
          return !/^\$/.test(v);
        }).value().length;
      });

      $scope.loadApp();
    }
  ]);
})();
