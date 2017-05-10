var gulp = require("gulp"),             // Task runner.
    uglify = require("gulp-uglify"),    // For JS minification.
    rename = require("gulp-rename"),    // For renaming files.
    concat = require("gulp-concat");    // For concatenating files.

/**
 * Minify JS task.
 * Minifies the password-strength.js file to password-strength.min.js.
 */
gulp.task("minify-js", function () {
    gulp.src("./password-strength.js")

        // Minify file.
        .pipe(uglify())

        // Rename file.
        .pipe(rename("password-strength.min.js"))

        // Save file.
        .pipe(gulp.dest("./dist/"));
});

/**
 * Concat JS task.
 * Minifies the password-strength.js file to password-strength.min.js.
 */
gulp.task("concat-js", function () {
    gulp.src(["./dist-header.js", "./dist/password-strength.min.js"])

        // Minify file.
        .pipe(concat("password-strength.min.js"))

        // Save file.
        .pipe(gulp.dest("./dist/"));
});

/**
 * Default task.
 * Watches for changes to password-strength.js and runs the minify-js task.
 */
gulp.task("default", function () {
    gulp.watch(["./password-strength.js", "./dist-header.js"], ["minify-js", "concat-js"])
});