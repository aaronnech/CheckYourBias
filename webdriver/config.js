exports.config = {
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        'webdriver/*.js'
    ],
    exclude: [
        'webdriver/config.js'
    ],

    capabilities: [{
        browserName: 'chrome'
    }],

    // with "/", the base url gets prepended.
    baseUrl: 'http://localhost:1337',

    // Default timeout for all waitForXXX commands.
    waitforTimeout: 10000,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },

    // Gets executed before all workers get launched.
    onPrepare: function() {
        console.log('Starting Webdriver Tests');
    },
    //
    // Gets executed before test execution begins. At this point you will have access to all global
    // variables like `browser`. It is the perfect place to define custom commands.
    before: function() {
    },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function(failures, pid) {
    },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() {
        console.log('Done.');
    }
};