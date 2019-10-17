import {resolve} from "path";
import {WebpackLayerConfigurator} from "../types";

export const baseConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const whereToSearchLoaders = [
        "node_modules",
        resolve(paths.ffbtRoot, "node_modules"),
    ];

    if (paths.project.nodeModules) {
        whereToSearchLoaders.push(paths.project.nodeModules);
    }

    return {
        mode: projectConfig.profile.optimizeBundle ? "production" : "development",
        context: paths.project.workingDirectory,
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            path: resolve(paths.project.root, projectConfig.profile.outputPath),
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
