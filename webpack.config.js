// npm start. http://localhost:3000/login



module.exports = {
    mode: "development",

    entry:{
        main: "./src/frontend/App.ts", // xử lí cho phần chơi
        user: "./src/frontend/UserApp.ts", // xử lí tên đăng nhập người chơi
    },

    output:{
        filename: "[name].bundle.js", // lưu tên
        chunkFilename: '[name].chunk.js',
        path: __dirname + "/dist/frontend", // đường dẫn lưu
        publicPath: "/assets/",
    },

    devtool:"source-map",

    resolve:{
        extensions:[".ts",".js", ".tsx"] // định dạng
    },

    module:{
        rules:[
            {
                test:/\.tsx?$/,
                loader:"ts-loader"
            },
            {
                enforce: "pre",
                test:/\.js$/,
                loader: "source-map-loader"
            },
            {
                test:/\.css$/,
                use:[{
                    loader: "style-loader"
                },{
                    loader: "css-loader"
                }]
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks: "all"
        },
        usedExports:true
    }
}