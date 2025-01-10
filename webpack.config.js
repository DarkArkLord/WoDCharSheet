const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

module.exports = {
    target: 'web',
    entry: {
        MtA20: path.resolve(environment.paths.source, 'entry', 'MtA20.js'),
    },
    output: {
        filename: '[name].js',
        path: environment.paths.output,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(environment.paths.source, 'index.html'),
            filename: 'index.html',
            inject: false,
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(environment.paths.source, 'blank.html'),
            filename: 'MtA20.html',
            inject: true,
            chunks: 'MtA20.js',
        }),
    ],
};