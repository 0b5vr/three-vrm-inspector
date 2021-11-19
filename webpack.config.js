/* eslint-env node */

const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = ( env, argv ) => {
  const isProd = argv.mode === 'production';

  const banner = isProd
    ? '(c) 2019 FMS_Cat - https://github.com/FMS-Cat/three-vrm-inspector/blob/master/LICENSE'
    : `three-vrm-inspector v${require( './package.json' ).version}

Copyright (c) 2019 FMS_Cat
three-vrm-inspector is distributed under the MIT License
https://github.com/FMS-Cat/three-vrm-inspector/blob/master/LICENSE`;

  return {
    mode: argv.mode,
    entry: path.resolve( __dirname, 'src', 'index.tsx' ),
    output: {
      path: path.resolve( __dirname, 'dist' ),
      filename: 'three-vrm-inspector.js',
      library: 'vrm',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|vrm|fbx)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.(frag|vert)$/,
          use: 'raw-loader',
        },
      ],
    },
    resolve: {
      extensions: [ '.js', '.ts', '.json', '.tsx' ],
      modules: [ 'node_modules' ],
    },
    devServer: {
      port: 3000,
      contentBase: path.resolve( __dirname, './' ),
      publicPath: '/dist/',
      openPage: 'examples/index.html',
      watchContentBase: true,
      inline: true,
    },
    plugins: [
      new webpack.BannerPlugin( banner ),
      // new webpack.DefinePlugin( { 'process.env': { NODE_ENV: argv.mode } } ),
      new HtmlWebpackPlugin( {
        template: './src/index.html'
      } ),
      ...( isProd ? [] : [ new ForkTsCheckerWebpackPlugin() ] ),
    ],
    devtool: isProd ? false : 'inline-source-map',
  };
};
