const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const prodMode = !devMode;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        },
    };

    if(prodMode) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin(),
        ];
    }

    return config;
};

const cssLoaders = extra => {
    let loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: devMode,
                reloadAll: true,
            },
        },
        'css-loader',
    ];

    if(extra) {
        loaders = [...loaders, ...extra];
    }

    return loaders;
};

const filename = extention => devMode ? `[name].${extention}` : `[name].[hash].${extention}`;

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/' + filename('js'),
    },
    devServer: {
        port: 3000,
        hot: devMode,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: prodMode,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/' + filename('css'),
        })
    ],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components')
        },
    },
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                        ]
                    },
                },
            },
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders([
                    'postcss-loader',
                    'sass-loader',
                ]),
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                }
            },
        ],
    },
};