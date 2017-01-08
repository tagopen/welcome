var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglifyjs'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    bower         = require('gulp-bower'),
    critical      = require('critical').stream;

gulp.task('sass', function() {
  return gulp.src(['app/sass/**/*.+(scss|sass)'])
    .pipe(sass({
      css: 'app/css',
      sass: 'app/sass',
      image: 'app/img'
    }))
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 9'], {cascade: true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', ['bower'], function() {
  return gulp.src([
      'app/libs/jquery/dist/jquery.js'
    ])
  //.pipe(concat('libs.js'))
  //.pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});
/*
// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
  return gulp.src('dist/*.html')
  .pipe(critical({base: 'dist/', inline: true, css: ['dist/styles/components.css','dist/styles/main.css']}))
  .pipe(gulp.dest('dist'));
});
*/
gulp.task('clean', function () {
  return del.sync('dist');
});

gulp.task('clear', function () {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
})

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
  gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
  var buildCss = gulp.src([
      'app/css/**/*.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/font/**/*')
    .pipe(gulp.dest('dist/font'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('buildMin', ['clean', 'img', 'sass', 'scripts'], function() {
  var buildCss = gulp.src([
      'app/css/**/*.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/font/**/*')
    .pipe(gulp.dest('dist/font'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});