import * as webpack from "webpack";
import {Environment} from "../core/environment-registry";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as WebpackDevServer from "webpack-dev-server";

export interface IProjectConfig {
    environments: Record<string, Partial<ProjectEnv>> & {
        default: ProjectEnv;
    };
    // copied from webpack typings because "PickProp" works bad in this case, I don't know why
    aliases?: Record<string, string>;
    noParse?: RegExp | RegExp[] | ((content: string) => boolean);
}

export interface ProjectEnv extends Environment, ProjectEnvProperties {
}

export interface ProjectEnvProperties {
    outputPath: string;
    browserlist: string | Array<string>; // See https://github.com/browserslist/browserslist for syntax
    sourceMapType: "(none)" | webpack.Options.Devtool;
    buildVersion: string;
    staticFilesSizeThresholdKb: number;
    optimizeBundle: boolean;
    analyzeBundle: boolean;
    verboseMode: boolean;
    showBuildNotifications: boolean;
    cleanDistFolderBeforeBuild: boolean;
    moveLibrariesToSeparateBundle: boolean;
    htmlWebpackPluginConfig: Partial<HtmlWebpackPlugin.Options>,
    devServerConfig: Partial<WebpackDevServer.Configuration>,
}

export const defaultConfig: IProjectConfig = {
    environments: {
        default: {
            browserlist: "last 2 versions",
            outputPath: "dist",
            sourceMapType: "(none)",
            buildVersion: String(Date()),
            staticFilesSizeThresholdKb: 8,
            optimizeBundle: false,
            analyzeBundle: false,
            verboseMode: false,
            showBuildNotifications: true,
            cleanDistFolderBeforeBuild: false,
            moveLibrariesToSeparateBundle: true,
            htmlWebpackPluginConfig: {},
            devServerConfig: {
                port: 9393,
                host: "0.0.0.0",
                open: true,
                overlay: true,
                inline: true,
                historyApiFallback: true,
                publicPath: "/",
                stats: {
                    colors: true,
                },
            },
        },
        development: {
            _extends: "default",
        },
        production: {
            _extends: "default",
            sourceMapType: "nosources-source-map",
            optimizeBundle: true,
            showBuildNotifications: false,
            cleanDistFolderBeforeBuild: true,
        }
    },
    noParse: undefined,
    aliases: {},
};
