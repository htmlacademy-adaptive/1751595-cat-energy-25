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

const minifyCSS = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss( [ autoprefixer() ] ))
  .pipe(csso())
  // .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
}

// copy files
const copyFiles = () => {
  return gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.html',
  'source/js/*.js'], {base: 'source'}) // {base: 'source'} - to keep directories structure
  .pipe(gulp.dest('build'))
}

const webpCatalogCopy = () => {
  return gulp.src('source/img/catalog/*.webp')
  .pipe(gulp.dest('build/img/catalog'));
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({inline: true}))
  .pipe(gulp.dest('build/img'))
}

// optimise

const svg = () => {
  return gulp.src('source/img/**/*.svg', {base: 'source'})
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


// clean

export const clean = () => del('build')

// Server

const server = (done) => {
  browser.init({
    server: {baseDir: 'source'}, // baseDir means directory which browser shows (source or build)
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
    copyFiles, optimiseImages, webpCatalogCopy, minifyCSS, svg,
  ),
  sprite,
);


export default gulp.series(
  styles, server, watcher
);
