const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Chinese Checkers",
            template: "src/main.html"
        })
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.bundle.js"
    }
}