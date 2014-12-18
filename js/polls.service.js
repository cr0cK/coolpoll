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
       * Return all polls data.
       */
      this.get = function () {
        return polls;
      };

      /**
       * Return the graphics urls.
       */
      this.getUrls = function () {
        if (!_.has(polls, user)) {
          return [];
        }

        if (!_.has(polls[user], 'urls')) {
          return [];
        }

        return JSON.parse(polls[user].urls);
      };

      /**
       * Return the feedback.
       */
      this.getFeedback = function () {
        if (!_.has(polls, user)) {
          return '';
        }

        return polls[user].feedback;
      };

      /**
       * Save a new value for the current user.
       */
      this.save = function (value) {
        if (!value) {
          value = [];
        }

        sync.$set(user, {
          urls: JSON.stringify(value)
        });
      };

      /**
       * Save feedback.
       */
      this.saveFeedBack = function (feedback) {
        sync.$update(user, {
          feedback: feedback
        });
      };
    }
  ]);
})();
