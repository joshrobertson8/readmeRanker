import axios from "axios";

export async function fetchRemoteReadme(repoUrl: string): Promise<string> {
  try {
    let owner: string, repo: string;

    // Handle different input formats
    if (repoUrl.includes("github.com")) {
      // Full GitHub URL format
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error(
          "Invalid GitHub repository URL. Expected format: https://github.com/owner/repo or owner/repo"
        );
      }
      [, owner, repo] = match;
    } else if (repoUrl.includes("/")) {
      // owner/repo format
      const parts = repoUrl.split("/");
      if (parts.length !== 2) {
        throw new Error(
          "Invalid repository format. Expected format: owner/repo or https://github.com/owner/repo"
        );
      }
      [owner, repo] = parts;
    } else {
      throw new Error(
        "Invalid repository format. Expected format: owner/repo or https://github.com/owner/repo"
      );
    }

    const cleanRepo = repo.replace(/\.git$/, ""); // Remove .git suffix if present

    // Try to fetch README via GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/readme`;

    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "ReadmeRanker/1.0.0",
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(
          "Repository or README.md not found. Please check the URL and ensure the repository is public."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "API rate limit exceeded or repository is private. Please try again later."
        );
      }
    }

    throw new Error(
      `Failed to fetch README: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
