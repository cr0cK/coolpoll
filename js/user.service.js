(function () {
  'use strict';

  angular.module('user', [
  ])

  .service('User', ['localStorageService', function (localStorage) {
    this.get = function () {
      return localStorage.get('username');
    };

    this.set = function (username) {
      localStorage.set('username', username);
    };

    this.remove = function () {
      localStorage.remove('username');
    };
  }]);
})();
