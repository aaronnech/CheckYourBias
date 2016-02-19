var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodeunit = require('gulp-nodeunit');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require("vinyl-source-stream");
var webdriver = require("gulp-webdriver");
var selenium = require('selenium-standalone');
var child_process = require("child_process");

seleniumServer = null;

gulp.task('default', ['bundleClient']);

gulp.task('webdriver', ['selenium'], function(cb) {
	var app = child_process.spawn(
		'npm',
		['run-script', 'serve'],
		{stdio: 'pipe'}
	);
	console.log('Building / Starting app... (takes a moment)');

	startTests = function() {
		var tests = gulp.src('webdriver/config.js');
		var p = tests.pipe(webdriver());
		p.on('error', function() {
			seleniumServer.kill();
			app.kill();
			process.exit(1);
		});
		p.on('finish', function() {
			seleniumServer.kill();
			app.kill();
			cb();
		});
	};

	app.stdout.on('data', function(data) {
		var testCommand = 'Listening on port 1337...';
		if (data.toString().indexOf(testCommand) != -1) {
			startTests();
		}
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