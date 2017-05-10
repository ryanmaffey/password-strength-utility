var gulp = require("gulp"),             // Task runner.
    uglify = require("gulp-uglify"),    // For JS minification.
    rename = require("gulp-rename"),    // For renaming files.
    concat = require("gulp-concat");    // For concatenating files.

/**
 * Minify JS task.
 * 
 * Minifies the password-strength.js file to password-strength.min.js.
 */
gulp.task("minify-js", function () {
    gulp.src("./password-strength.js")
        .pipe(uglify())
        .pipe(rename("password-strength.min.js"))
        .pipe(gulp.dest("./dist/"));
});

/**
 * Concat JS task.
 * 
 * Concatenates dist-header.js onto password-strength.min.js to form the 
 * commented distributable.
 */
gulp.task("concat-js", function () {
    gulp.src(["./dist-header.js", "./dist/password-strength.min.js"])
        .pipe(concat("password-strength.min.js"))
        .pipe(gulp.dest("./dist/"));
});

/**
 * Default task.
 * 
 * Watches for changes to certain files and runs the necessary tasks.
 */
gulp.task("default", function () {
    gulp.watch(["./password-strength.js", "./dist-header.js"], ["minify-js", "concat-js"])
});