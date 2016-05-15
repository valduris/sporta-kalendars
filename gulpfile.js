var gulp = require("gulp"),
    webpack = require("webpack-stream"),
    webpackConfig = require("./webpack.config.js");

gulp.task("default", function() {
    return gulp.src("src/client/index.js")
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("dist/"));
});