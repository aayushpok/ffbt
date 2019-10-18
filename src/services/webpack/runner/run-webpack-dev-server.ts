import {ServiceRunStrategy} from "./index";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import {cleanupIfError} from "../../../core/cleanup";

export class RunWebpackDevServerStrategy implements ServiceRunStrategy {
    constructor(private webpackConfig: webpack.Configuration) {
    }

    run(): void {
        const compiler = webpack(this.webpackConfig);
        const server = new WebpackDevServer(compiler, {
            ...this.webpackConfig.devServer,
            open: true,
            stats: {
                colors: true,
            },
        });

        const {port, host} = {
            port: 9091,
            host: "localhost",
            ...this.webpackConfig.devServer,
        };

        server.listen(port, host);

        cleanupIfError(() => {
            server.close();
        });
    }
}
