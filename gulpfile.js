var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodeunit = require('gulp-nodeunit');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require("vinyl-source-stream");
var webdriver = require("gulp-webdriver");
var child_process = require("child_process");


gulp.task('default', ['bundleClient']);

gulp.task('webdriver', function(cb) {
	runTests = function(success) {
		if(success) {
		    var tests = gulp.src('webdriver/config.js');

		    tests.pipe(webdriver());
		}
	};

	var child = child_process.spawn('node_modules\\.bin\\selenium-standalone.cmd', ['start'], {
      stdio: 'pipe'
    });
 	// var child = exec('node_modules\\.bin\\selenium-standalone.cmd start', function(err, stdout, stderr) {
 	// 	console.log(err);
 	// 	console.log(stdout);
 	// 	console.log(stderr);
 	// });
    // child.once('close', runTests);

    child.stdout.on('data', function(data) {
      console.log(data.toString());
      var sentinal = 'Selenium started';
      if (data.toString().indexOf(sentinal) != -1) {
        runTests(true);
      }
    });
});

gulp.task('compileTS', function() {
	var tsResult = gulp
				.src('src/**/*.ts')
				.pipe(ts({
					noEmitOnError : true,
					module: 'commonjs',
					outDir: 'bin'
				}));


	return tsResult.js.pipe(gulp.dest('./bin'));
});


gulp.task('bundleClient', ['compileTS', 'move'], function() {
	var b = browserify();

	// USING THE REACT TRANSFORM
	b.transform(reactify);

	// Grab the file to build the dependency graph from
	b.add('./bin/client/main.js');

	b.bundle()
	 .pipe(source('main.js'))
	 .pipe(gulp.dest('./bin/client/static/js'));
});

gulp.task('move', ['move-component', 'move-statics']);

gulp.task('move-component', function(cb) {
    // move components
    var jsx = gulp.src('src/client/component/**/*')
                  .pipe(gulp.dest('./bin/client/component'));

    jsx.on('end', function() {
        cb();
    });
});

gulp.task('move-statics', function() {
	var vendors = gulp
				.src('src/client/static/**/*');

	return vendors.pipe(gulp.dest('./bin/client/static'));
});

gulp.task('test', function() {
    var tests = gulp.src('bin/**/*.test.js');

    tests.pipe(nodeunit());
});