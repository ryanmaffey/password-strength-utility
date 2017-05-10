var gulp = require("gulp"),             // Task runner.
    uglify = require("gulp-uglify"),    // For JS minification.
    rename = require("gulp-rename");    // For renaming files.

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
 * Default task.
 * Watches for changes to password-strength.js and runs the minify-js task.
 */
gulp.task("default", function () {
    gulp.watch("./password-strength.js", ["minify-js"])
});