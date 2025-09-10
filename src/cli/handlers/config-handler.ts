import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { Logger } from "../services/logger";

export interface Config {
  ai: {
    enabled: boolean;
    provider: string;
  };
  scoring: {
    weights: Record<string, number>;
  };
  output: {
    format: "text" | "json";
    verbose: boolean;
  };
}

const defaultConfig: Config = {
  ai: {
    enabled: false,
    provider: "gemini",
  },
  scoring: {
    weights: {
      "Essential Documentation": 1.0,
      "Usage & Examples": 1.0,
      "Visual & Demo": 0.8,
      "Project Quality": 0.9,
      "Community & Legal": 0.7,
      "Advanced Features": 0.6,
    },
  },
  output: {
    format: "text",
    verbose: false,
  },
};

export class ConfigHandler {
  private logger: Logger;
  private configPath: string;

  constructor() {
    this.logger = new Logger();
    this.configPath = path.join(process.cwd(), ".readmeranker.json");
  }

  async init(): Promise<void> {
    try {
      if (fs.existsSync(this.configPath)) {
        this.logger.warn("⚠️  Configuration file already exists");
        return;
      }

      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2));
      this.logger.success(`✅ Configuration file created: ${this.configPath}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async show(): Promise<void> {
    try {
      const config = this.loadConfig();

      console.log(chalk.blue("📋 Current Configuration:"));
      console.log(JSON.stringify(config, null, 2));
    } catch (error) {
      this.handleError(error);
    }
  }

  loadConfig(): Config {
    if (!fs.existsSync(this.configPath)) {
      return defaultConfig;
    }

    try {
      const configData = fs.readFileSync(this.configPath, "utf-8");
      return { ...defaultConfig, ...JSON.parse(configData) };
    } catch (error) {
      this.logger.warn("⚠️  Invalid config file, using defaults");
      return defaultConfig;
    }
  }

  private handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : "Unknown error";
    this.logger.error(chalk.red("❌ Config error:"), message);
    process.exit(1);
  }
}
