var gulp   = require("gulp"),         // Task runner.
    uglify = require("gulp-uglify"),  // For JS minification.
    concat = require("gulp-concat"),  // For concatenating files.
    merge  = require('merge-stream'); // For merging multiple streams.


/**
 * JS task.
 */
gulp.task("js", function () {
    var distHeader = 
        gulp.src("./dist-header.js");

    /**
     * Minify password-strength.js;
     */
    var passwordStrengthsMinified =  
        gulp.src("./password-strength.js")
            .pipe(uglify());

    /**
     * Concatenates dist-header.js on top of the minified (uglified) 
     * password-strength.js to form the commented distributable.
     */
    var mergedStream = merge(distHeader, passwordStrengthsMinified)
        .pipe(concat('password-strength.min.js'))
        .pipe(gulp.dest('./dist'));

    return mergedStream;
});


/**
 * Default task.
 * 
 * Runs the "js" task on startup.
 * Watches for changes to .js files and runs the "js" task.
 */
gulp.task("default", ["js"], function () {
    gulp.watch(["**/*.js"], ["js"]);
});