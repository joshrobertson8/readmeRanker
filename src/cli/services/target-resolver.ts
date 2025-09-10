import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export interface TargetInfo {
  isLocal: boolean;
  resolvedPath: string;
}

export class TargetResolver {
  resolve(target: string): TargetInfo {
    const isLocal = this.isLocalTarget(target);
    const resolvedPath = isLocal ? this.resolveLocalPath(target) : target;

    return { isLocal, resolvedPath };
  }

  async readLocalFile(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error("README.md not found in the specified directory");
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  private isLocalTarget(target: string): boolean {
    return (
      target === "." ||
      target.startsWith(".") ||
      target.startsWith("/") ||
      !target.includes("/")
    );
  }

  private resolveLocalPath(target: string): string {
    return target === "." ? "./README.md" : path.join(target, "README.md");
  }
}
