(function () {
  'use strict';

  angular.module('specs', [
  ])

  .service('Specs', ['$http', '$q', function ($http, $q) {
    var specsFileUrl = 'json/poll-specs.json';
    var specs;

    /**
     * Return a promise resolved when initialized.
     */
    this.isReady = function () {
      var defer = $q.defer();

      $http.get(specsFileUrl)
        .success(function (data) {
          specs = data;
          defer.resolve(data);

          // console.log(data, status, headers, config);
          // this callback will be called asynchronously
          // when the response is available
        })
        .error(function (data) {
          defer.reject(data);

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

      return defer.promise;
    };

    /**
     * Return specs.
     */
    this.get = function () {
      return specs;
    };
  }]);
})();
