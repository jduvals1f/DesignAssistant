# UX Refactor Assistant

A Chrome extension that helps engineering teams detect UI/UX anti-patterns and generate improved React + Tailwind code with Radix UI components.

## Features

- **Screenshot Capture**: Capture current tab screenshots and extract React component structure
- **Heuristic Analysis**: Detect contrast, spacing, and component misuse issues
- **Code Generation**: Generate improved React + Tailwind code with Radix UI components
- **Unified Diffs**: Create copy-ready patches for easy integration
- **Brand Token Management**: Configure colors, fonts, and spacing scales
- **WCAG 2.2 AA Compliance**: Ensure accessibility standards

## Architecture

The extension follows the architecture specified in the PRD:

```
Chrome Extension
├── Popup UI (React + Tailwind)
├── Capture Service (Screenshot + JSX extraction)
├── Vision Analyzer (Element detection)
├── Heuristics Engine (Contrast, spacing, component rules)
├── AST Code Generator (Recast + Babel transformations)
├── Diff Builder (Unified diff generation)
└── Brand Token Store (IndexedDB persistence)
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS 3.5
- **UI Components**: Radix UI primitives, Shadcn/ui patterns
- **Code Processing**: Recast, Babel parser
- **Storage**: IndexedDB (idb)
- **Build Tool**: Vite 5
- **Chrome Extension**: Manifest V3

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ux-refactor-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Testing
```bash
npm test
```

## Usage

1. **Configure Brand Tokens**: Open the extension options to set your brand colors, fonts, and spacing scale
2. **Navigate to Target Page**: Go to any React application you want to analyze
3. **Capture & Analyze**: Click the extension icon and press "Capture & Analyze"
4. **Review Findings**: Check the detected issues in the Findings tab
5. **Generate Code**: View the improved React code in the Code tab
6. **Apply Changes**: Copy the unified diff and apply it to your codebase

## Heuristic Rules

### Contrast Checking
- Calculates WCAG 2.2 AA compliant contrast ratios
- Suggests accessible color combinations
- Supports large text (18pt+) and normal text requirements

### Spacing Analysis
- Analyzes margin and padding values
- Suggests consistent spacing using your brand scale
- Generates appropriate Tailwind classes

### Component Misuse
- Detects raw HTML elements that should use Radix components
- Suggests proper Radix UI primitives
- Maintains accessibility attributes

## Brand Token Configuration

Configure your design system in the extension options:

- **Primary Color**: Main brand color
- **Secondary Color**: Supporting brand color
- **Accent Colors**: Array of accent colors for various states
- **Font Family**: Typography preference
- **Spacing Scale**: Array of spacing values (e.g., [2, 4, 8, 16, 32])

## API Reference

### Types

```typescript
interface BrandToken {
  id: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string[];
  fontFamily: string;
  spacingScale: number[];
}

interface Finding {
  id: string;
  type: 'contrast' | 'spacing' | 'component-misuse';
  severity: 'error' | 'warn';
  location: DOMRect;
  suggestion: string;
  element?: HTMLElement;
  originalCode?: string;
  suggestedCode?: string;
}
```

### Services

- `captureService`: Screenshot and JSX extraction
- `heuristicsEngine`: Analysis rules and findings
- `codeGenerator`: AST transformations and code generation
- `brandTokenStore`: IndexedDB persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Multi-screen flow analysis
- [ ] GitHub Gist export
- [ ] CLI wrapper for CI pipelines
- [ ] Mobile support
- [ ] Edge/Firefox support
- [ ] Advanced component detection
- [ ] Performance optimization
- [ ] Custom rule creation 