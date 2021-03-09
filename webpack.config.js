module.exports = (env, options) => {
    const production = options.mode === 'production';
    const path = require('path');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    const autoprefixer = require('autoprefixer');
    const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const plugins = [
        new SpriteLoaderPlugin(),
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: true, cleanAfterEveryBuildPatterns: true, dry: true}),
        new CopyWebpackPlugin([{
            patterns: [
                {from: './dev/images', to: 'images'}
            ]
        }]),
        new MiniCssExtractPlugin({
            filename: production ? 'css/[name].[contenthash].css' : 'css/[name].dev.css',
            chunkFilename: production ? 'css/[id].[contenthash].css' : 'css/[name].dev.css',
        }),
        new HtmlWebpackPlugin({
            template: './dev/templates/pages/index.twig',
            filename: 'index.html'
        }),
    ];

    let conf = {
        entry: {
            'main': './dev/scripts/main.js',
            'assets': './dev/scripts/assets.js',
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: production ? 'js/[name].[contenthash].js' : 'js/[name].dev.js',
            publicPath: '/',
        },
        watchOptions: {
            ignored: '/node_modules/',
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000,
        },
        resolveLoader: {
            modules: ['node_modules', './node/loader'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                    exclude: /(node_modules|bower_components)/,

                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                autoprefixer: {
                                    browsers: ['last 2 versions'],
                                },
                                plugins: () => [
                                    autoprefixer,
                                ],
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: 'images/[name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: new RegExp(`fonts\\${path.sep}.+\\.(eot|svg|ttf|woff|woff2|otf)$`),
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]',
                    },
                },
                {
                    test: new RegExp(`icons\\${path.sep}.+\\.svg$`),
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: 'images/icons.svg',
                    },
                },
                {
                    test: /\.twig$/,
                    use: [
                        'raw-loader',
                        {
                            loader: 'twig-html-loader',
                            options: {
                                data: {}
                            }
                        }
                    ]
                }
            ],
        },
        plugins: plugins,
        devtool: 'eval-sourcemap',
    };

    conf.mode = production ? "production": "development";
    conf.devtool = production ? false : 'eval-source-map';

    return conf;
};
