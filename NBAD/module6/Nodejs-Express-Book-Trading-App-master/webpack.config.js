const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    index: './resources/index.js'
  },
  output: {
    filename: 'public/[name].js'
  },
  module: {
    rules: [{
      test: /\.sass$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015','react']
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin('public/public.css')
  ],
  watch: true
};
