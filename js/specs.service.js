(function () {
  'use strict';

  angular.module('specs', [])

  .service('Specs', ['$http', '$q', function ($http, $q) {
    /**
     * ...
     */
    this.get = function () {
      var defer = $q.defer();
      var specsFileUrl = 'json/poll-specs.json';

      $http.get(specsFileUrl).
        success(function(data, status, headers, config) {
          defer.resolve(data);

          // console.log(data, status, headers, config);
          // this callback will be called asynchronously
          // when the response is available
        }).
        error(function(data, status, headers, config) {
          defer.reject(data);

          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

      return defer.promise;
    };
  }]);
})();
