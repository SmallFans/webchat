module.exports = function(env = {}){
  const webpack     = require('webpack'),
        path        = require('path'),
        fs          = require('fs'),
        packageConf = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  let name      = packageConf.name,
      version   = packageConf.version,
      library   = name.replace(/^(\w)/, m => m.toUpperCase()),
      proxyPort = 8081,
      plugins   = [],
      loaders   = [];

  if(env.production){
    name += `-${version}.min`;
    //compress js in production environment
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false,
         }
      })
    );
  }
  let babelConf
  if(fs.existsSync('./.babelrc')){
    //use babel
    babelConf = JSON.parse(fs.readFileSync('.babelrc'));
    // loaders.push({
    //   test: /\.js$/,
    //   exclude: /(node_modules|bower_components)/,
    //   loader: 'babel-loader',
    //   query: babelConf
    // });
  }

  return {
    entry: './src/index.js',
    output: {
      filename: env.production ? name : 'index.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/js/'
    },

    plugins: plugins,

    module: {
      loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: babelConf
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          }
      ]
    },

    devServer: {
      proxy: {
        "*": `http://127.0.0.1:${proxyPort}`,
      }
    }
  };
}