var path = require("path"),
    webpack = require("webpack");

module.exports = {
    watch: true,
    entry: ["./src/client/js/index.js"],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"development"'
            },
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader"],
                include: path.resolve(__dirname, "src", "client", "js")
            },
            {
                test: /\.styl$/,
                loader: "style-loader!css-loader!stylus-loader"
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx", ".json"],
        fallback: path.join(__dirname, "node_modules")
    }
};
