const gulp = require("gulp");
const del = require("del");
const argv = require('yargs').argv;
const webpack = require('webpack-stream'); 


function webpackBuild(cb){
  return gulp.src('src/index.js')
    .pipe(
      webpack({
        mode: 'production',
        output: {
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules|bower_components)/,
              loader: "babel-loader",
              options: { presets: ["@babel/env"] }
            },
            {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
            }
          ]
        },
        resolve: { extensions: ["*", ".js", ".jsx"] },
      })
    ).pipe(gulp.dest('dist/'));
}
function clean() {
  return del(["./dist/"]);
}

function copyAllFiles() {
  return gulp 
  .src([
      "public/**/*.*"
    ]).pipe(gulp.dest("./dist/"));
}

function watch(cb) {
  if(argv.watch == undefined)
    return cb();
  return gulp.watch(
    [
      "src/**/*.*",
    ], gulp.series(webpackBuild, copyAllFiles));
}

exports.default = gulp.series(
  clean, webpackBuild , copyAllFiles, watch);