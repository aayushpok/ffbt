import * as webpack from "webpack";

// TODO: separate limit for fonts?
//  or add ability to setup separate limit for each kind of file
//  or for different subfolders?
export const assetsConfigLayer: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: {
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                    },
                },
            }
        ]
    },
};
