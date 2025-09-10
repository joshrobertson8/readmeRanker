import { Command } from "commander";
import { ConfigHandler } from "../handlers/config-handler";

export function configCommand(program: Command): void {
  const configCmd = program
    .command("config")
    .description("Manage ReadmeRanker configuration");

  configCmd
    .command("init")
    .description("Initialize configuration file")
    .action(async () => {
      const handler = new ConfigHandler();
      await handler.init();
    });

  configCmd
    .command("show")
    .description("Show current configuration")
    .action(async () => {
      const handler = new ConfigHandler();
      await handler.show();
    });
}
