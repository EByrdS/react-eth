const HtmlWebPackPlugin = require("html-webpack-plugin");
const { webpack } = require("webpack");
const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
    experiments: {
        topLevelAwait: true,
    },
    plugins: [htmlPlugin],
    devServer: {
        // publicPath: "/",
        historyApiFallback: true
    }
};

// const webpack = require("webpack");
// const path = require("path");

// module.exports = {
//   entry: path.resolve(__dirname, "./src/index.js"),
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: ["babel-loader"],
//       },
//     ],
//   },
//   resolve: {
//     extensions: ["*", ".js", ".jsx"],
//   },
//   output: {
//     path: path.resolve(__dirname, "./dist"),
//     filename: "bundle.js",
//   },
//   plugins: [new webpack.HotModuleReplacementPlugin()],
//   devServer: {
//     static: './dist',
//     hot: true,
//   },
//   experiments: {
//     topLevelAwait: true,
//   },
// };
