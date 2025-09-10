# ReadmeRanker 📊

[![npm version](https://badge.fury.io/js/readmeranker.svg)](https://badge.fury.io/js/readmeranker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A powerful command-line tool that analyzes README.md files and provides quality scores with actionable improvement suggestions. Perfect for open-source maintainers, developers, and teams who want to ensure their documentation meets high standards.

## ✨ Features

- **Comprehensive Analysis**: Evaluates 9 key areas of README quality
- **Local & Remote Support**: Analyze local files or GitHub repositories
- **Smart Scoring**: 100-point scoring system with detailed breakdowns
- **Actionable Suggestions**: Get specific recommendations for improvement
- **Multiple Output Formats**: Human-readable reports or JSON for automation
- **AI-Enhanced Suggestions**: Optional AI-powered improvement recommendations

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g readmeranker
```

### Local Installation

```bash
npm install readmeranker
npx readmeranker --help
```

### From Source

```bash
git clone https://github.com/yourusername/readmeranker.git
cd readmeranker
npm install
npm run build
npm link
```

## 📖 Usage

### Analyze Local README

```bash
# Analyze README.md in current directory
readmeranker .

# Analyze README.md in specific directory
readmeranker /path/to/project
```

### Analyze Remote Repository

```bash
# Analyze any public GitHub repository
readmeranker https://github.com/microsoft/vscode
readmeranker https://github.com/facebook/react
```

### Output Options

```bash
# JSON output for automation
readmeranker . --json

# AI-enhanced suggestions
readmeranker . --ai

# Combine flags
readmeranker https://github.com/nodejs/node --json --ai
```

## 📊 Scoring Rubric

ReadmeRanker evaluates your README across 9 critical areas:

| Section                         | Points | Description                        |
| ------------------------------- | ------ | ---------------------------------- |
| **Project Title & Description** | 10 pts | Clear project name and purpose     |
| **Installation Instructions**   | 15 pts | Step-by-step setup guide           |
| **Usage Examples**              | 15 pts | Code examples and demonstrations   |
| **Demo Content**                | 10 pts | Screenshots, GIFs, or videos       |
| **API/Features Documentation**  | 10 pts | Feature list or API reference      |
| **Contributing Guidelines**     | 10 pts | How to contribute to the project   |
| **License Information**         | 10 pts | License type and details           |
| **Status Badges**               | 10 pts | Build, coverage, or version badges |
| **Contact/Maintainer Info**     | 10 pts | Author or support contact details  |

**Total: 100 points**

## 🎯 Example Output

### Human-Readable Report

```
📊 ReadmeRanker Analysis Report
═══════════════════════════════════════════════════

📈 Overall Score: 72/100

✅ Found Sections:
  ✅ Project Title & Description (10/10 pts)
  ✅ Installation Instructions (15/15 pts)
  ✅ Usage Examples (15/15 pts)
  ✅ License (10/10 pts)
  ✅ Status Badges (10/10 pts)

⚠️  Missing Sections:
  ❌ Demo (0/10 pts)
  ❌ API/Features (0/10 pts)
  ❌ Contributing Guidelines (0/10 pts)

💡 Suggestions for Improvement:
  1. Add screenshots, GIFs, or video demonstrations
  2. Document the main features and API methods
  3. Add contribution guidelines to encourage community involvement

📋 Score Interpretation:
👍 Great! Your README covers most important sections.
```

### JSON Output

```json
{
  "score": 72,
  "found": [
    "Project Title & Description",
    "Installation Instructions",
    "Usage Examples",
    "License",
    "Status Badges"
  ],
  "missing": ["Demo", "API/Features", "Contributing Guidelines"],
  "suggestions": [
    "Add screenshots, GIFs, or video demonstrations",
    "Document the main features and API methods",
    "Add contribution guidelines to encourage community involvement"
  ]
}
```

## 🔧 Development

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/readmeranker.git
cd readmeranker

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev . --json
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Areas

- [ ] Additional scoring criteria
- [ ] Integration with more Git platforms (GitLab, Bitbucket)
- [ ] Plugin system for custom scoring rules
- [ ] Web interface
- [ ] GitHub Action integration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Maintainers

- **ReadmeRanker Team** - _Initial work_
- Email: support@readmeranker.dev
- Twitter: [@readmeranker](https://twitter.com/readmeranker)

## 🙏 Acknowledgments

- Inspired by various README quality tools and best practices
- Built with love for the open-source community
- Special thanks to all contributors and users

## 📈 Roadmap

- [ ] v1.1: GitHub Action integration
- [ ] v1.2: VS Code extension
- [ ] v1.3: Web dashboard
- [ ] v2.0: Multi-language documentation support

---

<div align="center">
  Made with ❤️ by the ReadmeRanker team
</div>
