import {Command, flags} from "@oclif/command";

export interface BaseFlags {
    verbose: boolean;
}

export abstract class BaseCommand extends Command {
    static flags: flags.Input<BaseFlags> = {
        verbose: flags.boolean({
            default: false,
        })
    };
}
