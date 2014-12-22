module.exports = {
  entry: "./src/app/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /app(\/|\\).+\.js$/,
      loader: 'traceur',
      query: {
        runtime: true,
        sourceMaps: true,
      }
    }, {
      test: /.+\.json$/,
      loader: 'json',
    }]
  },
};
