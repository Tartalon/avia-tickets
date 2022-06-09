// import path from 'path';
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()];
  }
  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./js/app.js"],
    // main: ['@babel/polyfill', './index.jsx'],
    // analytics: './analytics.ts',
  },

  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  optimization: optimization(),

  devServer: {
    port: 4200,
    static: "./src",
    hot: isDev,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    // new copyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/favicon.ico"),
    //       to: path.resolve(__dirname, "dist"),
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
      },

      {
        test: /\.scss$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          // 'style-loader',
          "css-loader",
          "sass-loader",
        ],
      },

      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      // {
      // 	test: /\.(ttf|woff|woff2|eot)$/,
      // 	use: ['file-loader'],
      // },
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },

      {
        test: /\.csv$/,
        use: ["csv-loader"],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions(),
        },
      },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },

      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
};
