import { Finding, BrandToken, DiffResult } from '@/types';

export class CodeGenerator {
  /**
   * Generate improved JSX code based on findings
   */
  async generateImprovedCode(originalJsx: string, findings: Finding[], brandTokens: BrandToken): Promise<string> {
    try {
      // For now, return a simplified version that applies basic improvements
      let improvedCode = originalJsx;

      // Apply component misuse fixes
      improvedCode = this.applyComponentFixes(improvedCode, findings);
      
      // Apply spacing fixes
      improvedCode = this.applySpacingFixes(improvedCode, findings, brandTokens);
      
      // Apply contrast fixes
      improvedCode = this.applyContrastFixes(improvedCode, findings, brandTokens);

      return this.formatCode(improvedCode);
    } catch (error) {
      console.error('Code generation failed:', error);
      return originalJsx;
    }
  }

  /**
   * Apply component misuse fixes using string replacement
   */
  private applyComponentFixes(code: string, findings: Finding[]): string {
    let improvedCode = code;
    
    const componentFindings = findings.filter(f => f.type === 'component-misuse');
    
    componentFindings.forEach(finding => {
      if (finding.originalCode && finding.suggestedCode) {
        improvedCode = improvedCode.replace(finding.originalCode, finding.suggestedCode);
      }
    });

    return improvedCode;
  }

  /**
   * Apply spacing fixes using string replacement
   */
  private applySpacingFixes(code: string, findings: Finding[], _brandTokens: BrandToken): string {
    let improvedCode = code;
    
    const spacingFindings = findings.filter(f => f.type === 'spacing');
    
    spacingFindings.forEach(finding => {
      if (finding.suggestion) {
        const match = finding.suggestion.match(/(\d+)px/);
        if (match) {
          const suggestedSpacing = parseInt(match[1]);
          const tailwindClass = this.getTailwindSpacingClass(suggestedSpacing);
          
          // Simple replacement - in a real implementation, you'd use AST parsing
          improvedCode = improvedCode.replace(
            /className="([^"]*)"/g,
            (_match, classes) => `className="${classes} p-${tailwindClass}"`
          );
        }
      }
    });

    return improvedCode;
  }

  /**
   * Apply contrast fixes using string replacement
   */
  private applyContrastFixes(code: string, findings: Finding[], _brandTokens: BrandToken): string {
    let improvedCode = code;
    
    const contrastFindings = findings.filter(f => f.type === 'contrast');
    
    if (contrastFindings.length > 0) {
      // Add contrast-improving classes
      improvedCode = improvedCode.replace(
        /className="([^"]*)"/g,
        (_match, classes) => `className="${classes} text-foreground bg-background"`
      );
    }

    return improvedCode;
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
   * Format the generated code
   */
  private formatCode(code: string): string {
    // Basic formatting
    return code
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '>\n<')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * Generate unified diff between original and improved code
   */
  async generateDiff(originalCode: string, improvedCode: string): Promise<DiffResult> {
    const diff = require('diff');
    
    const unifiedDiff = diff.createUnifiedDiff(
      'original.jsx',
      'improved.jsx',
      originalCode.split('\n'),
      improvedCode.split('\n'),
      { context: 3 }
    );

    const changes = diff.diffLines(originalCode, improvedCode).map((change: any) => ({
      type: change.added ? 'added' : change.removed ? 'removed' : 'modified',
      line: 0, // This would need more complex logic to determine actual line numbers
      content: change.value
    }));

    return {
      original: originalCode,
      generated: improvedCode,
      unifiedDiff: unifiedDiff.join('\n'),
      changes
    };
  }
}

export const codeGenerator = new CodeGenerator(); 