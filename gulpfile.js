var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodeunit = require('gulp-nodeunit');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require("vinyl-source-stream");
var istanbul = require("gulp-istanbul");
var webdriver = require("gulp-webdriver");
var selenium = require('selenium-standalone');
var child_process = require("child_process");
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');

seleniumServer = null;

gulp.task('default', ['bundleClient']);

gulp.task('serve', ['default'], function(cb) {
	var app = connect().use(serveStatic('./bin/client/static'));
	appServer = http.createServer(app).listen(1337, cb);
	console.log('Listening on 1337...');
});

gulp.task('webdriver', ['selenium', 'serve'], function(cb) {
	var tests = gulp.src('webdriver/config.js');
	var p = tests.pipe(webdriver());
	p.on('error', function() {
		seleniumServer.close();
		appServer.close();
		process.exit(1);
	});
	p.on('finish', function() {
		seleniumServer.kill();
		appServer.close();
		cb();
	});
});

gulp.task('selenium', function(cb) {
	selenium.install({logger: console.log}, function() {
		selenium.start(function(err, child) {
			seleniumServer = child;
			cb();
		});
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
	 .on('error', function(err) {
	 	console.error(err.message);
	 	this.emit('end');
	 })
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

gulp.task('pre-test', function () {
  return gulp.src('bin/common/*.js')
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
    var tests = gulp.src('bin/**/*.test.js');

    tests
      .pipe(nodeunit())
      .on('error', function() {
      	process.exit(1);
      })
      .pipe(istanbul.writeReports())
      .on('end', function() {
      	process.exit(0);
      });
});
