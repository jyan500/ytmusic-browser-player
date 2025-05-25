const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")

module.exports = {
    entry: {
        popup: path.resolve("./src/popup/index.tsx"),
        background: path.resolve("./src/background/background.js"),
        offscreen: path.resolve("./src/offscreen/index.tsx")
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve("src/static"),
                    to: path.resolve("dist")
                },
            ],
        }),
        ...getHtmlPlugins(["popup", "offscreen"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            "chrome": false,
        },
    },
    output: {
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk]
            })
    );
}
