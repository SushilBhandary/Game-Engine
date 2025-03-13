const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devServer: {
        static: './dist',
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
};