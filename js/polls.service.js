/* global Firebase */

(function () {
  'use strict';

  angular.module('polls', [
    'user',
    'firebase'
  ])

  .service('Polls', [
    '$q', 'User', '$firebase',
    function ($q, User, $firebase) {
      var sync, polls;
      var user = User.get();

      /**
       * Return a promise resolved when initialized.
       */
      this.isReady = function (specs) {
        var ref = new Firebase(specs.db);
        sync = $firebase(ref);
        polls = sync.$asObject();
        return polls.$loaded();
      };

      /**
       * Return the polls for the current user.
       */
      this.get = function () {
        if (!_.has(polls, user)) {
          return [];
        }

        return JSON.parse(polls[user]);
      };

      /**
       * Save a new value for the current user.
       */
      this.save = function (value) {
        if (!value) {
          value = [];
        }

        var setValue = {};
        setValue[user] = JSON.stringify(value);

        sync.$set(setValue);
      };
    }
  ]);
})();
