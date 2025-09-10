import { Command } from "commander";
import { AnalyzeHandler } from "../handlers/analyze-handler";

export function analyzeCommand(program: Command): void {
  program
    .argument(
      "[target]",
      "Local directory path (.) or GitHub repository URL (owner/repo)",
      "."
    )
    .action(async (target: string, options: any) => {
      const handler = new AnalyzeHandler();
      await handler.execute(target, options);
    });
}
