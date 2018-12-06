const database = require('./database');

const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
  colors: 1,           // (0|false)|(1|true)|2
  cleanStack: 1,       // (0|false)|(1|true)|2|3
  verbosity: 4,        // (0|false)|1|2|(3|true)|4
  listStyle: 'indent', // "flat"|"indent"
  activity: false,     // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
  emoji: true,
  beep: false 
}); 

// Executes when running tests from the command line
jasmine.getEnv().addReporter(reporter);
jasmine.getEnv().beforeEach(database.setup);