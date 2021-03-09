module.exports = {
    plugins: [
        require('autoprefixer')({
            //'browsers': ['> 1%', 'last 2 versions']
            browsers:['ie >= 10', 'last 4 version']
        }),
        require('cssnano')({
            preset: 'default',
        }),
    ]
};
