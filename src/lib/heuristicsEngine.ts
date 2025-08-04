import { Finding, HeuristicRule, BrandToken } from '@/types';
import { designBestPractices, DesignPrinciple } from './designBestPractices';

export class HeuristicsEngine {
  private rules: HeuristicRule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules = [
      this.createContrastRule(),
      this.createSpacingRule(),
      this.createComponentMisuseRule(),
      this.createDesignBestPracticesRule()
    ];
  }

  /**
   * Analyze all elements on the page and return findings
   */
  async analyzePage(brandTokens: BrandToken): Promise<Finding[]> {
    const findings: Finding[] = [];
    
    // Get all interactive and text elements
    const elements = document.querySelectorAll('button, input, a, p, h1, h2, h3, h4, h5, h6, div, span');
    
    for (const element of elements) {
      if (element instanceof HTMLElement) {
        for (const rule of this.rules) {
          const finding = rule.check(element, brandTokens);
          if (finding) {
            findings.push(finding);
          }
        }
      }
    }

    return findings;
  }

  /**
   * Create contrast checking rule
   */
  private createContrastRule(): HeuristicRule {
    return {
      id: 'contrast-check',
      name: 'Color Contrast Check',
      description: 'Check if text has sufficient contrast against background',
      check: (element: HTMLElement, brandTokens: BrandToken): Finding | null => {
        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        
        if (!backgroundColor || !color || backgroundColor === 'transparent') {
          return null;
        }

        const contrast = this.calculateContrast(backgroundColor, color);
        const isLargeText = this.isLargeText(element);
        const requiredContrast = isLargeText ? 3.0 : 4.5; // WCAG 2.2 AA

        if (contrast < requiredContrast) {
          return {
            id: `contrast-${Date.now()}-${Math.random()}`,
            type: 'contrast',
            severity: 'error',
            location: element.getBoundingClientRect(),
            suggestion: `Increase contrast ratio from ${contrast.toFixed(2)}:1 to at least ${requiredContrast}:1. Consider using a darker text color or lighter background.`,
            element,
            originalCode: element.outerHTML,
            suggestedCode: this.suggestContrastFix(element, brandTokens)
          };
        }

        return null;
      }
    };
  }

  /**
   * Create spacing analysis rule
   */
  private createSpacingRule(): HeuristicRule {
    return {
      id: 'spacing-check',
      name: 'Spacing Consistency Check',
      description: 'Check if spacing follows consistent grid system',
      check: (element: HTMLElement, brandTokens: BrandToken): Finding | null => {
        const style = window.getComputedStyle(element);
        const margin = parseFloat(style.margin) || 0;
        const padding = parseFloat(style.padding) || 0;
        
        if (margin === 0 && padding === 0) {
          return null;
        }

        const spacingValues = brandTokens.spacingScale;
        const nearestSpacing = this.findNearestSpacing(margin + padding, spacingValues);
        const tolerance = 2; // Allow 2px tolerance

        if (Math.abs(margin + padding - nearestSpacing) > tolerance) {
          return {
            id: `spacing-${Date.now()}-${Math.random()}`,
            type: 'spacing',
            severity: 'warn',
            location: element.getBoundingClientRect(),
            suggestion: `Use consistent spacing: ${nearestSpacing}px instead of ${margin + padding}px. Consider using Tailwind classes like 'p-${this.getTailwindSpacingClass(nearestSpacing)}' or 'm-${this.getTailwindSpacingClass(nearestSpacing)}'.`,
            element,
            originalCode: element.outerHTML,
            suggestedCode: this.suggestSpacingFix(element, nearestSpacing)
          };
        }

        return null;
      }
    };
  }

  /**
   * Create design best practices rule
   */
  private createDesignBestPracticesRule(): HeuristicRule {
    return {
      id: 'design-best-practices',
      name: 'Design Best Practices Check',
      description: 'Check for adherence to comprehensive UX/UI design best practices',
      check: (element: HTMLElement, brandTokens: BrandToken): Finding | null => {
        const checks = designBestPractices.runChecks(element, { brandTokens });
        const failedChecks = checks.filter(c => !c.passed);
        
        if (failedChecks.length > 0) {
          const mostCritical = failedChecks.find(c => c.check.principle.severity === 'critical') || failedChecks[0];
          
          return {
            id: `best-practice-${Date.now()}-${Math.random()}`,
            type: 'component-misuse',
            severity: mostCritical.check.principle.severity === 'critical' ? 'error' : 'warn',
            location: element.getBoundingClientRect(),
            suggestion: mostCritical.suggestion,
            element,
            originalCode: element.outerHTML,
            suggestedCode: mostCritical.codeFix || this.suggestBestPracticeFix(element, mostCritical.check.principle)
          };
        }

        return null;
      }
    };
  }

  /**
   * Create component misuse rule
   */
  private createComponentMisuseRule(): HeuristicRule {
    return {
      id: 'component-misuse',
      name: 'Component Misuse Check',
      description: 'Check for raw HTML elements that should use Radix components',
      check: (element: HTMLElement, _brandTokens: BrandToken): Finding | null => {
        const tagName = element.tagName.toLowerCase();
        const componentMapping = this.getComponentMapping(tagName, element);
        
        if (componentMapping) {
          return {
            id: `component-${Date.now()}-${Math.random()}`,
            type: 'component-misuse',
            severity: 'warn',
            location: element.getBoundingClientRect(),
            suggestion: `Replace <${tagName}> with ${componentMapping.radixComponent} for better accessibility and consistency.`,
            element,
            originalCode: element.outerHTML,
            suggestedCode: this.suggestComponentFix(element, componentMapping)
          };
        }

        return null;
      }
    };
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private calculateContrast(bgColor: string, textColor: string): number {
    const bgLuminance = this.getLuminance(bgColor);
    const textLuminance = this.getLuminance(textColor);
    
    const lighter = Math.max(bgLuminance, textLuminance);
    const darker = Math.min(bgLuminance, textLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get luminance of a color
   */
  private getLuminance(color: string): number {
    const rgb = this.parseColor(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): number[] | null {
    // Handle rgba/rgb
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbaMatch) {
      return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])];
    }

    // Handle hex
    const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (hexMatch) {
      return [parseInt(hexMatch[1], 16), parseInt(hexMatch[2], 16), parseInt(hexMatch[3], 16)];
    }

    return null;
  }

  /**
   * Check if text is considered large (18pt+ or 14pt+ bold)
   */
  private isLargeText(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight) || 400;
    
    return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  }

  /**
   * Find nearest spacing value from the scale
   */
  private findNearestSpacing(value: number, spacingScale: number[]): number {
    return spacingScale.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }

  /**
   * Get Tailwind spacing class name
   */
  private getTailwindSpacingClass(pixels: number): string {
    const spacingMap: Record<number, string> = {
      2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8', 40: '10', 48: '12', 64: '16', 80: '20', 96: '24'
    };
    return spacingMap[pixels] || pixels.toString();
  }

  /**
   * Get component mapping for HTML elements
   */
  private getComponentMapping(tagName: string, _element: HTMLElement): any {
    const mappings: Record<string, any> = {
      'button': {
        radixComponent: 'Button',
        props: { variant: 'default' },
        className: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
      },
      'input': {
        radixComponent: 'Input',
        props: {},
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
      },
      'select': {
        radixComponent: 'Select',
        props: {},
        className: ''
      }
    };

    return mappings[tagName] || null;
  }

  /**
   * Suggest contrast fix
   */
  private suggestContrastFix(element: HTMLElement, _brandTokens: BrandToken): string {
    // This would generate improved JSX with better contrast
    const improvedElement = element.cloneNode(true) as HTMLElement;
    improvedElement.style.color = '#000000'; // Suggest black text
    return improvedElement.outerHTML;
  }

  /**
   * Suggest spacing fix
   */
  private suggestSpacingFix(element: HTMLElement, spacing: number): string {
    const improvedElement = element.cloneNode(true) as HTMLElement;
    improvedElement.className = `p-${this.getTailwindSpacingClass(spacing)}`;
    return improvedElement.outerHTML;
  }

  /**
   * Suggest component fix
   */
  private suggestComponentFix(element: HTMLElement, mapping: any): string {
    const props = Object.entries(mapping.props).map(([key, value]) => `${key}="${value}"`).join(' ');
    const className = mapping.className ? ` className="${mapping.className}"` : '';
    
    return `<${mapping.radixComponent} ${props}${className}>${element.textContent}</${mapping.radixComponent}>`;
  }

  /**
   * Suggest best practice fix
   */
  private suggestBestPracticeFix(element: HTMLElement, principle: DesignPrinciple): string {
    return designBestPractices.generateCodeSuggestions(element, principle);
  }
}

export const heuristicsEngine = new HeuristicsEngine(); 