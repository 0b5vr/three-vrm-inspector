/* eslint-env node */

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

export default ( env: any, argv: any ): webpack.Configuration => {
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
          test: /\.(png|jpe?g|gif)$/i,
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
      ...( isProd ? [] : [ new ForkTsCheckerWebpackPlugin( { checkSyntacticErrors: true } ) ] ),
    ],
    devtool: isProd ? false : 'inline-source-map',
  };
};
