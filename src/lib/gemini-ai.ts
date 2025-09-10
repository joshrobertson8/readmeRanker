import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "./types";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
  }

  async generateAISuggestions(
    analysis: AnalysisResult,
    readmeContent: string
  ): Promise<string[]> {
    try {
      const prompt = this.createPrompt(analysis, readmeContent);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAISuggestions(text);
    } catch (error) {
      console.warn(
        "AI suggestions unavailable:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return this.getFallbackSuggestions(analysis);
    }
  }

  private createPrompt(
    analysis: AnalysisResult,
    readmeContent: string
  ): string {
    const wordCount = readmeContent.split(/\s+/).length;
    const hasCodeBlocks = readmeContent.includes("```");
    const hasImages = readmeContent.includes("![");

    // Get the weakest categories for focused advice
    const weakestCategories = Object.entries(analysis.categories)
      .sort((a, b) => a[1].percentage - b[1].percentage)
      .slice(0, 3)
      .map(([name, data]) => `${name}: ${data.percentage.toFixed(1)}%`)
      .join(", ");

    return `You are a CLI tool providing brief, actionable README improvement suggestions. Analyze this README and provide 5-7 concise suggestions.

ANALYSIS CONTEXT:
Score: ${analysis.score.toFixed(1)}/${analysis.maxScore.toFixed(1)} (${analysis.percentage.toFixed(1)}%)
Grade: ${analysis.grade}
Weakest areas: ${weakestCategories}
Missing: ${analysis.missing.slice(0, 5).join(", ")}

README CONTENT:
${readmeContent.substring(0, 2000)}${readmeContent.length > 2000 ? "..." : ""}

REQUIREMENTS:
- Provide 5-7 brief, specific suggestions (1-2 sentences each)
- Focus on the weakest categories and missing sections
- Use simple emojis (like 📖 💻 🚀) but NO markdown formatting
- Be direct and actionable
- Each suggestion should be 50-150 characters

Example format:
🚀 Add installation instructions with npm/yarn commands
📖 Include code examples showing basic usage
🔧 Add troubleshooting section for common issues

Respond with numbered suggestions only, no headers or explanations:`;
  }

  private parseAISuggestions(aiResponse: string): string[] {
    // Parse the AI response into individual suggestions
    const lines = aiResponse.split("\n").filter((line) => line.trim());
    const suggestions: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Look for numbered items, bullet points, or emoji-prefixed lines
      if (
        trimmed.match(/^\d+\./) ||
        trimmed.match(/^[\-\*]/) ||
        trimmed.match(/^[📝🎯💡🔧⭐🚀📊📋💻🖼️👥♿📖🛡️⏱️]/u)
      ) {
        // Clean up the suggestion - remove numbering and formatting
        let suggestion = trimmed
          .replace(/^\d+\.\s*/, "")
          .replace(/^[\-\*]\s*/, "")
          .replace(/\*\*/g, "") // Remove markdown bold
          .replace(/\*/g, "") // Remove markdown italic
          .replace(/`([^`]+)`/g, "$1") // Remove code backticks
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove markdown links, keep text
          .trim();

        // Only include suggestions that are reasonable length and quality
        if (suggestion.length > 15 && suggestion.length < 200) {
          suggestions.push(suggestion);
        }
      }
    }

    // If we didn't get enough suggestions, try to extract from sentences
    if (suggestions.length < 3) {
      const sentences = aiResponse
        .replace(/\*\*/g, "") // Remove markdown
        .replace(/\*/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter((s) => s.length > 20 && s.length < 150);
      
      return sentences.slice(0, 5);
    }

    return suggestions.slice(0, 7);
  }

  private getFallbackSuggestions(analysis: AnalysisResult): string[] {
    // Enhanced fallback suggestions based on analysis
    const suggestions: string[] = [];

    // Category-specific fallbacks
    const categoryScores = Object.entries(analysis.categories).sort(
      (a, b) => a[1].percentage - b[1].percentage
    );

    for (const [categoryName, categoryData] of categoryScores.slice(0, 2)) {
      if (categoryData.percentage < 70) {
        suggestions.push(
          this.getCategoryFallbackSuggestion(categoryName)
        );
      }
    }

    // Quality metric fallbacks
    const metrics = analysis.qualityMetrics;
    if (metrics.readability < 0.7) {
      suggestions.push("📖 Use clear headings and shorter paragraphs");
    }
    if (metrics.professionalism < 0.7) {
      suggestions.push("💼 Add status badges and fix formatting consistency");
    }
    if (metrics.accessibility < 0.7) {
      suggestions.push("♿ Add alt text for images and descriptive links");
    }

    // General improvements based on score
    if (analysis.percentage < 50) {
      suggestions.push("🚀 Use a README template for better structure");
      suggestions.push("📚 Study popular project READMEs for examples");
    }

    return suggestions.slice(0, 6);
  }

  private getCategoryFallbackSuggestion(categoryName: string): string {
    const suggestionMap: { [key: string]: string } = {
      "Essential Documentation": "📋 Add clear project description and installation steps",
      "Usage & Examples": "💻 Include code examples with expected outputs",
      "Visual & Demo": "🖼️ Add screenshots or GIFs showing the project in action",
      "Project Quality": "⭐ Include status badges and testing information", 
      "Community & Legal": "👥 Add contributing guidelines and license info",
      "Advanced Features": "🚀 Document configuration and troubleshooting",
    };

    return suggestionMap[categoryName] || `🔧 Improve ${categoryName} section`;
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.GEMINI_API_KEY;
  }
}
