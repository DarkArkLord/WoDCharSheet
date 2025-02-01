const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const SYSTEMS = Object.freeze({
    MageTheAscension20: 'MtA20',
});

module.exports = {
    target: 'web',
    entry: {
        [SYSTEMS.MageTheAscension20]: path.resolve(environment.paths.source, 'entry', `${SYSTEMS.MageTheAscension20}.js`),
    },
    output: {
        filename: '[name].js',
        path: environment.paths.output,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                loader: 'ts-loader',
            },
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
            filename: `${SYSTEMS.MageTheAscension20}.html`,
            inject: true,
            chunks: `${SYSTEMS.MageTheAscension20}.js`,
        }),
    ],
};