# ReadmeRanker

Analyze your `README.md` files and get quality scores with actionable improvement suggestions.  
ReadmeRanker provides both **local analysis** and **remote GitHub repo analysis**, with optional AI‑powered recommendations (Gemini).

## Features

- **Comprehensive scoring** of README quality across categories:
  - Essential Documentation
  - Usage & Examples
  - Visual & Demo
  - Project Quality
  - Community & Legal
  - Advanced Features
- **AI‑enhanced suggestions** (optional, Gemini support)
- **Local and remote analysis** (local folder or `owner/repo`)
- **Validation mode** for checking structure without scoring
- **Configurable scoring weights** and output formats
- **JSON output** for integration with CI pipelines

## Quick Start

### Installation

```bash
# Clone the repo and install dependencies
git clone https://github.com/yourname/readmeranker.git
cd readmeranker
npm install
npm run build
```

Alternatively, add it globally:

```bash
npm install -g readmeranker
```

### Usage

Run against the current directory:

```bash
readmeranker .
```

Run against a GitHub repository:

```bash
readmeranker facebook/react
```

Output as JSON (great for CI):

```bash
readmeranker . --json
```

Enable AI suggestions (requires `GEMINI_API_KEY` in `.env`):

```bash
readmeranker . --ai
```

Validate README format only:

```bash
readmeranker validate . --strict
```

Show current config:

```bash
readmeranker config show
```

## Demo

A full demo is available in `demo.sh`. Example:

```bash
./demo.sh
```

The script runs:

- Local README analysis (verbose)
- JSON output format
- AI‑enhanced suggestions
- Remote repo analysis
- Validation with `--strict`
- Config commands

## Configuration

ReadmeRanker uses a `.readmeranker.json` file at the project root. Example:

```json
{
  "ai": {
    "enabled": false,
    "provider": "gemini"
  },
  "scoring": {
    "weights": {
      "Essential Documentation": 1,
      "Usage & Examples": 1,
      "Visual & Demo": 0.8,
      "Project Quality": 0.9,
      "Community & Legal": 0.7,
      "Advanced Features": 0.6
    }
  },
  "output": {
    "format": "text",
    "verbose": false
  }
}
```

## Development

Build the project:

```bash
npm run build
```

Run in dev mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Tech Stack

- TypeScript
- Commander for CLI
- Jest for testing
- Chalk for terminal output
- Axios for remote fetching
- `@google/generative-ai` (optional)


## Example Output

```
📊 ReadmeRanker Comprehensive Analysis
=====================================
📈 Overall Score: 72.5/100.0 (72.5%)
🎯 Grade: B-

📊 Quality Metrics:
  📖 Readability:      [██████████░░░░░░░░░░] 50.0%
  ✅ Completeness:     [████████████░░░░░░░░] 65.0%
  💼 Professionalism:  [█████████████░░░░░░░] 70.0%
  ♿ Accessibility:    [████████░░░░░░░░░░░░] 40.0%
  🔧 Maintainability:  [███████████░░░░░░░░░] 55.0%
```
