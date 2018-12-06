module.exports = function () {
  return {
    files: [
      'src/**/*.js',
      '!src/**/*.spec.js'
    ],

    tests: [
      'src/**/*.spec.js'
    ],

    env: {
      type: 'node'
    },

    setup: (wallaby) => {
      // Setup tests when running via wallaby because wallaby does not execute spec/support/helpers.js
      const database = require(wallaby.localProjectDir + '/spec/support/database');
      jasmine.getEnv().beforeEach(database.setup);
    },

    testFramework: 'jasmine'
  };
};