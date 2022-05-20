import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import squoosh from 'gulp-squoosh';
import rename from 'gulp-rename';
import csso from 'gulp-csso';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

export const minifyCSS = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss( [ autoprefixer() ] ))
  .pipe(csso())
  // .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
}

// copy files
export const copyFiles = () => {
  return gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.html',
  'source/js/*.js'], {base: 'source'}) // {base: 'source'} - to use directories structure
  .pipe(gulp.dest('build'))
}

export const copyImages = () => {
  return gulp.src('source/img/*.{png,jpg}')
  .pipe(gulp.dest('build/img'))
}

export const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({inline: true}))
  .pipe(gulp.dest('build/img'))
}

// optimise

export const svg = () => {
  return gulp.src('source/img/**/*.svg', {base: 'source'})
  .pipe(svgo())
  .pipe(gulp.dest('build'))
}

export const optimiseImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}


// clean

const clean = () => {
  return del('build');
  };

// Server

const server = (done) => {
  browser.init({
    server: {baseDir: 'build'}, // baseDir means directory browser shows
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export const build = gulp.series(
  clean, copyFiles, optimiseImages,
  gulp.parallel(
  minifyCSS, svg,
  ),
  sprite,
);


export default gulp.series(
  styles, server, watcher
);
