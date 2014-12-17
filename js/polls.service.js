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
      var user, ref, sync, polls;


      /**
       * Return a promise resolved when initialized.
       */
      this.isReady = function (specs) {
        user = User.get();
        ref = new Firebase(specs.db);
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

        sync.$set(user, JSON.stringify(value));
      };
    }
  ]);
})();
