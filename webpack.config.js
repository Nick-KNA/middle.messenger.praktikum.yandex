const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/pages/index.ts',
    resolve: {
        extensions: ['.ts', '.js', '.pug'],
        fallback: {
            "fs": false,
            "os": false
        },
        alias: {
            process: "process/browser"
        }
    },
    output: {
        filename: `bundle.js`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /test/, /\.spec\.ts$/]
            },
            {
                test: /\.pug?$/,
                use: 'pug-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: false,
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],

    devServer: {
        compress: true,
        port: 1234,
        hot: true,
        historyApiFallback: true
    },
};