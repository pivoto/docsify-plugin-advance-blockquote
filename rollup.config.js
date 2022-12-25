const path = require('path');

import autoprefixer from 'autoprefixer';
import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import merge from 'lodash.merge';
import pkg from './package.json';
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve';
import url from '@rollup/plugin-url';

import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';

// Banner
const bannerData = [
	`${pkg.name} - v${pkg.version}`,
	`(c) ${(new Date()).getFullYear()} ${pkg.author}`,
	`License: ${pkg.license}`
];

// Plugins
const pluginSettings = {
  eslint: {
    exclude: ['node_modules/**', 'cheerio/**', './package.json', '**/*.scss'],
    throwOnWarning: false,
    throwOnError: true
  },
  babel: {
    exclude: ['node_modules/**'],
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', {
        modules: false,
        targets: {
          browsers: ['ie >= 9']
        }
      }]
    ]
  },
  postcss: {
    minimize: true,
    plugins: [
      autoprefixer()
    ]
  },
  url: {
    limit: 10 * 1024, // inline files < 10k, copy files > 10k
    include: ["**/*.svg"], // defaults to .svg, .png, .jpg and .gif files
    emitFiles: true // defaults to true
  },
  uglify: {
    beautify: {
      compress: false,
      mangle: false,
      output: {
        beautify: true,
        comments: /(?:^!|@(?:license|preserve))/
      }
    },
    minify: {
      compress: true,
      mangle: true,
      output: {
        comments: new RegExp(pkg.name)
      }
    }
  }
};


// Config Base
const config = {
  input: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    file: path.resolve(__dirname, 'dist', `index.js`),
    banner: `/*!\n * ${bannerData.join('\n * ')}\n */`,
    sourcemap: true
  },
  plugins: [
    url(pluginSettings.url),
    postcss(pluginSettings.postcss),
    resolve(),
    commonjs(),
    json(),
    // eslint(pluginSettings.eslint),
    babel(pluginSettings.babel)
  ],
  watch: {
    clearScreen: false
  }
};

// Format: IIFE
const iife = merge({}, config, {
  output: {
    format: 'iife'
  },
  plugins: [
    uglify(pluginSettings.uglify.beautify)
  ]
});

// Format: IIFE (Minified)
const iifeMinified = merge({}, config, {
  output: {
    file: iife.output.file.replace(/\.js$/, '.min.js'),
    format: iife.output.format
  },
  plugins: [
    uglify(pluginSettings.uglify.minify)
  ]
});


export default [
  iife,
  iifeMinified
];
