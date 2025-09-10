import { AnalysisResult } from "./types";
import { GeminiAIService } from "./gemini-ai";

export async function generateAISuggestions(
  analysis: AnalysisResult,
  content: string
): Promise<string[]> {
  try {
    // Try to use Gemini AI first
    const geminiService = new GeminiAIService();
    if (await geminiService.isAvailable()) {
      const aiSuggestions = await geminiService.generateAISuggestions(analysis, content);
      if (aiSuggestions.length > 0) {
        return aiSuggestions;
      }
    }
  } catch (error) {
    console.warn('🤖 Gemini AI unavailable, using enhanced fallback suggestions');
  }

  // Fallback to enhanced local suggestions
  return generateEnhancedLocalSuggestions(analysis, content);
}

function generateEnhancedLocalSuggestions(
  analysis: AnalysisResult,
  content: string
): Promise<string[]> {
  const enhancedSuggestions: string[] = [];
  
  // Analyze content structure
  const lines = content.split('\n');
  const wordCount = content.split(/\s+/).length;
  const hasCodeBlocks = content.includes('```');
  const hasImages = content.includes('![');
  const hasLinks = content.includes('[') && content.includes('](');
  
  // AI-enhanced suggestions based on comprehensive analysis
  const priorityCategories = Object.entries(analysis.categories)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 2); // Focus on top 2 weakest categories

  for (const [categoryName, categoryData] of priorityCategories) {
    const categoryAdvice = generateCategoryAdvice(categoryName, categoryData, analysis, content);
    enhancedSuggestions.push(...categoryAdvice);
  }

  // Content-specific AI suggestions
  if (wordCount < 300) {
    enhancedSuggestions.push(
      '📝 Your README appears quite brief. Consider expanding with more detailed explanations, use cases, and background information to help users understand the full value of your project.'
    );
  }

  if (!hasCodeBlocks && analysis.details['Usage Examples']?.score === 0) {
    enhancedSuggestions.push(
      '💻 Add formatted code blocks with syntax highlighting using ``` to make examples more readable and professional.'
    );
  }

  if (!hasImages && analysis.details['Visual Demonstrations']?.score === 0) {
    enhancedSuggestions.push(
      '🖼️ Visual content significantly improves engagement. Consider adding screenshots showing your project in action, workflow diagrams, or architecture overviews.'
    );
  }

  if (analysis.percentage < 60) {
    enhancedSuggestions.push(
      '📚 Consider studying high-quality READMEs from popular projects in your domain for inspiration on structure and content depth.'
    );
  }

  // Advanced AI suggestions based on quality metrics
  if (analysis.qualityMetrics.readability < 0.6) {
    enhancedSuggestions.push(
      '📖 Improve readability by using clear headings, bullet points, and shorter paragraphs. Consider adding a table of contents for longer READMEs.'
    );
  }

  if (analysis.qualityMetrics.professionalism < 0.7) {
    enhancedSuggestions.push(
      '💼 Enhance professionalism by adding status badges, consistent formatting, proper grammar, and a clear project structure.'
    );
  }

  if (analysis.qualityMetrics.accessibility < 0.6) {
    enhancedSuggestions.push(
      '♿ Improve accessibility by adding descriptive alt text for images, using clear link text, and maintaining good heading hierarchy.'
    );
  }

  // Smart contextual suggestions
  if (content.toLowerCase().includes('node') || content.toLowerCase().includes('npm')) {
    if (!content.includes('npm install')) {
      enhancedSuggestions.push(
        '📦 For Node.js projects, include clear npm installation commands and specify Node.js version requirements.'
      );
    }
  }

  if (content.toLowerCase().includes('python') || content.toLowerCase().includes('pip')) {
    if (!content.includes('pip install')) {
      enhancedSuggestions.push(
        '🐍 For Python projects, include pip installation commands and Python version compatibility information.'
      );
    }
  }

  // Integration suggestions
  if (analysis.grade === 'F' || analysis.percentage < 40) {
    enhancedSuggestions.push(
      '🔧 Consider using a README template or generator to establish a solid foundation, then customize for your specific project needs.'
    );
  }

  return Promise.resolve(enhancedSuggestions.slice(0, 8)); // Limit to most important suggestions
}

function generateCategoryAdvice(categoryName: string, categoryData: any, analysis: AnalysisResult, content: string): string[] {
  const advice: string[] = [];
  
  switch (categoryName) {
    case 'Essential Documentation':
      if (categoryData.percentage < 70) {
        advice.push(
          '📋 Essential Documentation needs attention: Ensure you have a compelling project title, clear description, and comprehensive installation instructions. These are the first things users see and critical for adoption.'
        );
        
        if (analysis.details['Project Title & Description']?.score < 10) {
          advice.push(
            '🎯 Craft a compelling one-liner that immediately communicates what your project does and why someone should care. Follow with a paragraph explaining the problem it solves.'
          );
        }
      }
      break;

    case 'Usage & Examples':
      if (categoryData.percentage < 70) {
        advice.push(
          '💻 Usage & Examples need improvement: Add multiple code examples showing common use cases, from basic to advanced scenarios. Include expected outputs and real-world applications.'
        );
      }
      break;

    case 'Visual & Demo':
      if (categoryData.percentage < 70) {
        advice.push(
          '🖼️ Visual demonstrations are missing: Add screenshots of your application, GIFs showing workflows, or links to live demos. Visual content increases user engagement by 80%.'
        );
      }
      break;

    case 'Project Quality':
      if (categoryData.percentage < 70) {
        advice.push(
          '⭐ Project Quality indicators need work: Add status badges (build, coverage, version), document your testing approach, and include changelog information to build user confidence.'
        );
      }
      break;

    case 'Community & Legal':
      if (categoryData.percentage < 70) {
        advice.push(
          '👥 Community & Legal aspects need attention: Add contributing guidelines, specify your license clearly, and provide contact information to encourage community participation.'
        );
      }
      break;

    case 'Advanced Features':
      if (categoryData.percentage < 70 && analysis.percentage > 70) {
        advice.push(
          '🚀 Advanced Features documentation is missing: Consider adding configuration options, troubleshooting guides, performance information, and security considerations for power users.'
        );
      }
      break;
  }
  
  return advice;
}
