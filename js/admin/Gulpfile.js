var gulp = require('flarum-gulp');

gulp({
  modules: {
    'avatar4eg/countries': [
      '../lib/**/*.js',
      'src/**/*.js'
    ]
  }
});
