import {ProjectConfig} from "../../../project-config";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import {ProjectPaths} from "../../../paths";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => webpack.Configuration;

export function createWebpackConfig(projectConfig: ProjectConfig, workingDirectory: string): webpack.Configuration {
    const layers: Array<WebpackLayerConfigurator> = [
        require("./layers/base").baseConfigLayer,
        require("./layers/typescript").typescriptConfigLayer,
        require("./layers/styles").stylesConfigLayer,
        require("./layers/index-file").indexFileConfigLayer,
        require("./layers/include-html").includeHtmlConfigLayer,
        require("./layers/assets").assetsConfigLayer,
        require("./layers/globals").globalsConfigLayer,
        require("./layers/dev-server").devServerConfigLayer,
    ];

    if (projectConfig.env.showBuildNotifications) {
        layers.push(require("./layers/build-notfications").buildNotificationsConfigLayer);
    }

    if (projectConfig.env.analyzeBundle) {
        layers.push(require("./layers/bundle-analyze").bundleAnalyzeConfigLayer);
    }

    if (projectConfig.env.cleanDistFolderBeforeBuild) {
        layers.push(require("./layers/clean-dist").cleanDistFolderConfigLayer);
    }

    if (projectConfig.env.moveLibrariesToSeparateBundle) {
        layers.push(require("./layers/vendor-bundle").vendorBundleConfigLayer);
    }

    if (projectConfig.env.optimizeBundle) {
        layers.push(require("./layers/caching").cachingConfigLayer);
    }

    const paths = new ProjectPaths(workingDirectory);

    const customWebpackLayer = projectConfig.configureWebpack;
    if (customWebpackLayer) {
        layers.push(customWebpackLayer);
    }

    const configuredWebpackLayers = layers.map(layer => layer(projectConfig, paths));

    return webpackMerge.smart(...configuredWebpackLayers);
}
