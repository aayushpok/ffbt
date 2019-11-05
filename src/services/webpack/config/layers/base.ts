import {resolve} from "path";
import {WebpackLayerConfigurator} from "../index";

export const baseConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const whereToSearchLoaders = [
        "node_modules",
        resolve(paths.ffbtRoot, "node_modules"),
    ];

    if (paths.projectNodeModules) {
        whereToSearchLoaders.push(paths.projectNodeModules);
    }

    return {
        mode: projectConfig.env.optimizeBundle ? "production" : "development",
        context: paths.projectWorkingDirectory,
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            path: resolve(paths.projectRoot, projectConfig.env.outputPath),
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            }
        },
        module: {
            noParse: projectConfig.noParse,
            rules: [],
        },
        resolve: {
            alias: projectConfig.aliases,
        },
        resolveLoader: {
            modules: whereToSearchLoaders,
        }
    };
};
