import { AnalysisResult } from "./types";
import chalk from "chalk";

export function generateReport(analysis: AnalysisResult, target: string): void {
  console.log("\n" + chalk.bold.cyan("📊 ReadmeRanker Comprehensive Analysis"));
  console.log(chalk.gray("═".repeat(60)));

  if (target !== "local") {
    console.log(chalk.blue(`🔗 Repository: ${target}`));
  }

  // Overall Score and Grade
  console.log(
    chalk.bold(
      `📈 Overall Score: ${getScoreColor(analysis.percentage)(
        analysis.score.toFixed(1)
      )}/${analysis.maxScore.toFixed(1)} (${analysis.percentage.toFixed(1)}%)`
    )
  );
  console.log(
    chalk.bold(`🎯 Grade: ${getGradeColor(analysis.grade)(analysis.grade)}`)
  );
  console.log("");

  // Quality Metrics
  console.log(chalk.bold.magenta("📊 Quality Metrics:"));
  const metrics = analysis.qualityMetrics;
  console.log(
    `  📖 Readability:      ${getMetricBar(metrics.readability)} ${(
      metrics.readability * 100
    ).toFixed(1)}%`
  );
  console.log(
    `  ✅ Completeness:     ${getMetricBar(metrics.completeness)} ${(
      metrics.completeness * 100
    ).toFixed(1)}%`
  );
  console.log(
    `  💼 Professionalism:  ${getMetricBar(metrics.professionalism)} ${(
      metrics.professionalism * 100
    ).toFixed(1)}%`
  );
  console.log(
    `  ♿ Accessibility:    ${getMetricBar(metrics.accessibility)} ${(
      metrics.accessibility * 100
    ).toFixed(1)}%`
  );
  console.log(
    `  🔧 Maintainability:  ${getMetricBar(metrics.maintainability)} ${(
      metrics.maintainability * 100
    ).toFixed(1)}%`
  );
  console.log("");

  // Category Breakdown
  console.log(chalk.bold.blue("📂 Category Breakdown:"));
  Object.entries(analysis.categories).forEach(([category, data]) => {
    const color =
      data.percentage >= 80
        ? chalk.green
        : data.percentage >= 60
        ? chalk.yellow
        : chalk.red;
    console.log(
      color(
        `  ${getCategoryIcon(category)} ${category}: ${data.score.toFixed(
          1
        )}/${data.maxScore.toFixed(1)} (${data.percentage.toFixed(1)}%)`
      )
    );
  });
  console.log("");

  // Detailed Section Analysis
  console.log(chalk.bold.green("✅ Strong Areas:"));
  const strongSections = analysis.found
    .map((item) => ({
      name: item,
      details: analysis.details[item],
      score: analysis.details[item].score / analysis.details[item].maxScore,
    }))
    .filter((item) => item.score >= 0.8)
    .sort((a, b) => b.score - a.score);

  if (strongSections.length > 0) {
    strongSections.forEach((item) => {
      console.log(
        chalk.green(
          `  ✅ ${item.name} (${item.details.score.toFixed(1)}/${
            item.details.maxScore
          } pts) - ${item.details.reason}`
        )
      );
      if (item.details.subScores) {
        Object.entries(item.details.subScores).forEach(
          ([subName, subScore]) => {
            if (subScore > 0) {
              console.log(
                chalk.green(`     • ${subName}: ${subScore.toFixed(1)} pts`)
              );
            }
          }
        );
      }
    });
  } else {
    console.log(chalk.gray("    No sections with strong coverage found"));
  }
  console.log("");

  // Areas for Improvement
  const improvementSections = Object.entries(analysis.details)
    .map(([name, details]) => ({
      name,
      details,
      score: details.score / details.maxScore,
    }))
    .filter((item) => item.score < 0.8)
    .sort((a, b) => a.score - b.score);

  if (improvementSections.length > 0) {
    console.log(chalk.bold.yellow("⚠️  Areas for Improvement:"));
    improvementSections.forEach((item) => {
      const color = item.score === 0 ? chalk.red : chalk.yellow;
      const icon = item.score === 0 ? "❌" : "⚠️";
      console.log(
        color(
          `  ${icon} ${item.name} (${item.details.score.toFixed(1)}/${
            item.details.maxScore
          } pts) - ${item.details.reason}`
        )
      );

      if (item.details.subScores) {
        Object.entries(item.details.subScores).forEach(
          ([subName, subScore]) => {
            const subColor = subScore === 0 ? chalk.red : chalk.yellow;
            console.log(
              subColor(`     • ${subName}: ${subScore.toFixed(1)} pts`)
            );
          }
        );
      }
    });
    console.log("");
  }

  // Prioritized Suggestions
  if (analysis.suggestions.length > 0) {
    console.log(chalk.bold.blue("💡 Prioritized Improvement Suggestions:"));
    const prioritizedSuggestions = analysis.suggestions
      .map((suggestion, index) => ({
        suggestion,
        priority: getPriority(analysis.missing[index], analysis.details),
      }))
      .sort((a, b) => b.priority - a.priority);

    prioritizedSuggestions.forEach((item, index) => {
      const priorityIcon =
        item.priority >= 15 ? "🔥" : item.priority >= 10 ? "⭐" : "💡";
      console.log(
        chalk.blue(`  ${index + 1}. ${priorityIcon} ${item.suggestion}`)
      );
    });
    console.log("");
  }

  // Final Assessment
  console.log(chalk.bold("🎯 Final Assessment:"));
  console.log(getDetailedInterpretation(analysis));
  console.log("");

  // Next Steps
  console.log(chalk.bold.cyan("🚀 Recommended Next Steps:"));
  const nextSteps = getNextSteps(analysis);
  nextSteps.forEach((step, index) => {
    console.log(chalk.cyan(`  ${index + 1}. ${step}`));
  });
  console.log("");
}

function getScoreColor(percentage: number): (text: string) => string {
  if (percentage >= 90) return chalk.green.bold;
  if (percentage >= 80) return chalk.green;
  if (percentage >= 70) return chalk.yellow.bold;
  if (percentage >= 60) return chalk.yellow;
  return chalk.red.bold;
}

function getGradeColor(grade: string): (text: string) => string {
  if (grade.startsWith("A")) return chalk.green.bold;
  if (grade.startsWith("B")) return chalk.green;
  if (grade.startsWith("C")) return chalk.yellow;
  if (grade.startsWith("D")) return chalk.red;
  return chalk.red.bold;
}

function getMetricBar(value: number): string {
  const width = 20;
  const filled = Math.round(value * width);
  const empty = width - filled;

  let bar = "";
  for (let i = 0; i < filled; i++) {
    bar +=
      value >= 0.8
        ? chalk.green("█")
        : value >= 0.6
        ? chalk.yellow("█")
        : chalk.red("█");
  }
  for (let i = 0; i < empty; i++) {
    bar += chalk.gray("░");
  }
  return `[${bar}]`;
}

function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    "Essential Documentation": "📋",
    "Usage & Examples": "💻",
    "Visual & Demo": "🖼️",
    "Project Quality": "⭐",
    "Community & Legal": "👥",
    "Advanced Features": "🚀",
  };
  return icons[category] || "📁";
}

function getPriority(
  missingItem: string,
  details: { [key: string]: any }
): number {
  const detail = details[missingItem];
  if (!detail) return 5;

  // Higher priority for higher point values and essential categories
  let priority = detail.maxScore;

  // Boost priority for essential items
  const essentialItems = [
    "Project Title & Description",
    "Installation Instructions",
    "Usage Examples",
  ];
  if (essentialItems.includes(missingItem)) {
    priority += 5;
  }

  return priority;
}

function getDetailedInterpretation(analysis: AnalysisResult): string {
  const percentage = analysis.percentage;
  const grade = analysis.grade;

  let interpretation = "";

  if (percentage >= 95) {
    interpretation = chalk.green(
      "🌟 Outstanding! Your README is exemplary and sets a high standard for documentation quality."
    );
  } else if (percentage >= 90) {
    interpretation = chalk.green(
      "🎉 Excellent! Your README is comprehensive and professional."
    );
  } else if (percentage >= 80) {
    interpretation = chalk.green(
      "👍 Great work! Your README covers most essential areas effectively."
    );
  } else if (percentage >= 70) {
    interpretation = chalk.yellow(
      "📈 Good foundation! Focus on adding the missing key sections to reach excellence."
    );
  } else if (percentage >= 60) {
    interpretation = chalk.yellow(
      "📝 Decent start! Your README has potential but needs significant improvements."
    );
  } else if (percentage >= 40) {
    interpretation = chalk.red(
      "⚠️  Your README needs major improvements to be effective for users."
    );
  } else {
    interpretation = chalk.red(
      "🔧 Your README requires substantial work to meet basic documentation standards."
    );
  }

  // Add specific feedback based on strongest and weakest areas
  const categories = Object.entries(analysis.categories);
  const strongest = categories.reduce((a, b) =>
    a[1].percentage > b[1].percentage ? a : b
  );
  const weakest = categories.reduce((a, b) =>
    a[1].percentage < b[1].percentage ? a : b
  );

  interpretation += `\n\n💪 Strongest area: ${
    strongest[0]
  } (${strongest[1].percentage.toFixed(1)}%)`;
  interpretation += `\n🎯 Focus area: ${
    weakest[0]
  } (${weakest[1].percentage.toFixed(1)}%)`;

  return interpretation;
}

function getNextSteps(analysis: AnalysisResult): string[] {
  const steps: string[] = [];
  const percentage = analysis.percentage;

  if (percentage < 60) {
    steps.push(
      "Start with essential documentation: clear title, description, and installation instructions"
    );
    steps.push("Add basic usage examples with code snippets");
    steps.push("Include a simple getting started guide");
  } else if (percentage < 80) {
    steps.push("Add visual demonstrations (screenshots, GIFs, or videos)");
    steps.push("Document your API or main features comprehensively");
    steps.push(
      "Include contributing guidelines to encourage community involvement"
    );
  } else {
    steps.push(
      "Add advanced features like troubleshooting guides and performance information"
    );
    steps.push("Include security considerations and best practices");
    steps.push("Consider adding benchmarks and comparison with alternatives");
  }

  // Always include improvement for lowest scoring category
  const categories = Object.entries(analysis.categories);
  const weakest = categories.reduce((a, b) =>
    a[1].percentage < b[1].percentage ? a : b
  );

  if (weakest[1].percentage < 70) {
    steps.push(
      `Prioritize improvements in ${
        weakest[0]
      } (currently ${weakest[1].percentage.toFixed(1)}%)`
    );
  }

  return steps;
}
