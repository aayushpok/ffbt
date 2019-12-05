import {dirname, resolve} from "path";
import {locateDirectory, locateEntrypoint, locateFile} from "../core/locate";
import {Memoize} from "../core/memoize-decorator";
import {ProjectConfig} from "./";

export class ProjectPaths {
    constructor(private config: ProjectConfig) {
    }

    private get sourcesDirectory() {
        return this.config.sourcesDirectory;
    }

    private get env() {
        return this.config.env;
    }

    getAll() {
        return {
            ffbtRoot: this.ffbtRoot,
            projectConfig: this.projectConfig,
            projectPackageJson: this.projectPackageJson,
            projectRoot: this.projectRoot,
            projectWorkingDirectory: this.projectWorkingDirectory,
            projectNodeModules: this.projectNodeModules,
            projectEntrypoint: this.projectEntrypoint,
            projectTsConfig: this.projectTsConfig,
            destination: this.destination,
        }
    }

    @Memoize()
    get ffbtRoot(): string {
        return dirname(locateFile("package.json", __dirname));
    }

    @Memoize()
    get projectConfig(): string | null {
        return ProjectConfig.getPathToConfigFile(this.sourcesDirectory);
    }

    @Memoize()
    get projectPackageJson(): string | null {
        return locateFile("package.json", this.sourcesDirectory, false) || null;
    }

    @Memoize()
    get projectRoot(): string {
        const rootsInPriority = [
            this.projectConfig,
            this.projectPackageJson,
            this.projectWorkingDirectory,
        ];

        const firstValidRoot = rootsInPriority.find((path) => Boolean(path));

        if (!firstValidRoot) {
            throw new Error("Can't determine the project's root");
        }

        return dirname(firstValidRoot);
    }

    get projectWorkingDirectory(): string {
        return this.sourcesDirectory;
    }

    @Memoize()
    get projectNodeModules(): string | null {
        return locateDirectory("node_modules", this.sourcesDirectory, false) || null;
    }

    @Memoize()
    get projectEntrypoint(): string {
        return locateEntrypoint(this.sourcesDirectory, this.env.entrypointName);
    }

    @Memoize()
    get projectTsConfig(): string {
        return locateFile(this.env.tsconfigPath, this.projectRoot);
    }

    @Memoize()
    get destination(): string {
        return resolve(this.projectRoot, this.env.outputPath);
    }
}
