import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {WebpackLayerConfigurator} from "../index";
import {CompilerOptions} from "typescript";
import {readJson} from "../../../../core/read-json";

interface TsConfig {
    compilerOptions: CompilerOptions;
}

export const typescriptConfigLayer: WebpackLayerConfigurator = (projectConfig) => {
    const {paths} = projectConfig;
    const tsConfigPath = paths.projectTsConfig;
    const tsConfig = readJson<TsConfig>(tsConfigPath);
    const plugins: Array<any> = [];

    if (projectConfig.env.enableTypeChecking) {
        plugins.push(
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsConfigPath,
            })
        );
    }

    return {
        devtool: projectConfig.env.sourceMapType as any, // Webpack doesn't have "(none)" value in typings
        entry: {
            main: paths.projectEntrypoint,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        configFile: tsConfigPath,
                        compilerOptions: {
                            jsx: tsConfig.compilerOptions.jsx || "react",
                        },
                        experimentalWatchApi: true,
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins,
    };
};
