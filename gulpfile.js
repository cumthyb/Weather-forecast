/*
 * @Author: hongyongbo
 * @Date: 2018-12-30 16:25:58
 * @LastEditors: hongyongbo
 * @LastEditTime: 2018-12-30 22:56:08
 * @Description: gulp 构建钉钉小程序 样式文件采用less
 * @Notice: 注意gulp、gulp-less 版本匹配
 */



const { series, watch, parallel, src, dest } = require('gulp');
const rename = require('gulp-rename');// 重命名文件
const less = require('gulp-less');//转换less至css 不符合less语法的会报错
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
const del = require('del');//清理文件夹或者文件 返回promise
const cleanCSS = require('gulp-clean-css'); //压缩css
const uglifyJS = require('gulp-uglify');//仅仅压缩js代码 并不能处理es6语法 有es6语法会报错
const terser = require('gulp-terser');//可以压缩es6语法的js
const babel = require('gulp-babel');//转换es6
const destBase = "output/"


function js() {
  return src('src/**/*.js')
    // .pipe(babel({ presets: ['es2015', 'stage-0'] }))
    // .pipe(terser())
    // .pipe(uglifyJS())
    .pipe(dest(destBase));
}

function html() {
  return src('src/**/*.html')
    .pipe(rename({ extname: '.axml' }))
    .pipe(dest(destBase));
}

function css() {
  return src('src/**/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.acss' }))
    .pipe(dest(destBase));
}

function json() {
  return src('src/**/*.json')
    .pipe(dest(destBase));
}

function imgs() {
  return src('src/**/*.{jpg,png}')
    .pipe(dest(destBase));
}

function clean() {
  return del(
    [destBase]
  );
}

let parallel_tasks = parallel(js, html, css, json, imgs)

watch('src/**/*.less', { events: 'all', delay: 500 }, css);
watch('src/**/*.html', { events: 'all', delay: 500 }, html);
watch('src/**/*.js', { events: 'all', delay: 500 }, js);
watch('src/**/*.json', { events: 'all', delay: 500 }, json);
watch('src/**/*.{png,jpg}', { events: 'all', delay: 500 }, imgs);
watch('src/', { events: ['addDir', 'unlinkDir'], delay: 1000 }, parallel_tasks);

exports.default = series(clean, parallel_tasks);