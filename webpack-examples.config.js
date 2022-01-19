const StringReplacePlugin = require('string-replace-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');

var path = require('path');

var base = require('./webpack.config');

var rules = base.module.rules.concat([{
  test: /\.pug$/,
  use: ['pug-load']
}, {
  test: /\.(woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
  type: 'asset/inline'
}, {
  test: require.resolve('codemirror'),
  use: [{
    loader: 'expose-loader',
    options: {exposes: 'CodeMirror'}
  }]
}, {
  test: /bootstrap.css$/,
  use: [StringReplacePlugin.replace({
    replacements: [{
      pattern: /@import.*fonts.googleapis.com\/css\?family=Lato[^;]*;/g,
      replacement: () => '@import url(../../typeface-lato/index.css);'
    }]
  })]
}]);

var plugins = base.plugins;
plugins.push(new StringReplacePlugin());

var resolve = {
  extensions: ['.js', '.css', '.pug', '...'],
  alias: base.resolve.alias
};

module.exports = {
  mode: 'production',
  performance: {hints: false},
  devtool: 'source-map',
  context: path.join(__dirname),
  entry: {
    bundle: './examples/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist', 'examples'),
    publicPath: '/examples/',
    filename: '[name].js'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // uncomment out to avoid minimizing for testing
        // exclude: '**/*',
        extractComments: false,
        parallel: true
      })
    ]
  },
  module: {
    rules: rules
  },
  resolve: resolve,
  plugins: plugins
};
