import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import squoosh from 'gulp-libsquoosh';
import rename from 'gulp-rename';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
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

// minify

const minifyCSS = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss( [ autoprefixer() ] ))
  .pipe(csso())
  // .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
}

export const minifyHTML = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'))
}

export const minifyJS = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

// copy files
const copyFiles = () => {
  return gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/manifest.webmanifest',
  'source/*img/**/*.webp'], {base: 'source'}) // {base: 'source'} - to keep directories structure
  .pipe(gulp.dest('build'))
}

// optimise

export const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg'], {base: 'source'})
  .pipe(svgo())
  .pipe(gulp.dest('build'))
}

const optimiseImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

export const webpCatalog = () => {
  return gulp.src('source/img/catalog/*.{png,jpg}')
  .pipe(squoosh( { webp: {} } ))
  .pipe(gulp.dest('source/img/catalog'))
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({inline: true}))
  .pipe(gulp.dest('build/img'))
}

// clean

export const clean = () => del('build')

// Server

const server = (done) => {
  browser.init({
    server: {baseDir: 'build'}, // baseDir means which directory browser shows (source or build)
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const serverSource = (done) => {
  browser.init({
    server: {baseDir: 'source'}, // baseDir means which directory browser shows (source or build)
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
  clean,
  gulp.parallel(
    copyFiles, optimiseImages, minifyCSS, minifyHTML, minifyJS, svg,
  ),
  sprite,
);

export default gulp.series(
  build, server
);

export const watch = gulp.series(
  styles, serverSource, watcher
);
