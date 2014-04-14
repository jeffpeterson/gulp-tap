# gulp-tap

Easily tap into a pipeline.

## Usage

Some filters like `gulp-coffee` process all files. What if you want to process
all JS and Coffee files in a single pipeline. Use tap to filter out `.coffee`
files and process them through coffee filter and let JavaScript files passthrough.

```javascript
gulp.src("src/**/*.{coffee,js}")
  .pipe(tap(function(file, t) {
    if (path.extname(file.path) === '.coffee') {
      return t.through(coffee, {bare: true});
    }
  }))
  .pipe(gulp.dest('build'));
```

What if you want to change content like add a header? No need for a separate
filter, just change the content.

```javascript
tap(function(file) {
  file.content = Buffer.concat([
    new Buffer('HEADER'),
    file.content
  ]);
});
```

If you do not return a stream, tap forwards your changes.

## License

The MIT License (MIT)
