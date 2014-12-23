module.exports = {
  entry: "app_modules/app/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    modulesDirectories: ["web_modules", "node_modules", "app_modules"],
    //   alias: {
    //     'app': './src/app'
    //   }
  },
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
