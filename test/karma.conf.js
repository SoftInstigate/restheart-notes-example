// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-07-06 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      '../app/bower_components/jquery/dist/jquery.js',
      '../app/bower_components/angular/angular.js',
      '../app/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      '../app/bower_components/angular-animate/angular-animate.js',
      '../app/bower_components/angular-cookies/angular-cookies.js',
      '../app/bower_components/angular-resource/angular-resource.js',
      '../app/bower_components/angular-route/angular-route.js',
      '../app/bower_components/angular-sanitize/angular-sanitize.js',
      '../app/bower_components/angular-touch/angular-touch.js',
      '../app/bower_components/angular-ui-router/release/angular-ui-router.js',
      '../app/bower_components/oclazyload/dist/ocLazyLoad.js',
      '../app/bower_components/lodash/lodash.js',
      '../app/bower_components/restangular/dist/restangular.js',
      '../app/bower_components/angular-local-storage/dist/angular-local-storage.js',
      '../app/bower_components/angular-base64/angular-base64.js',
      '../app/bower_components/angular-restheart/angular-restheart.js',
      '../app/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
