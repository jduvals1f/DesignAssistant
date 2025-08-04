// Design Best Practices Knowledge Base
// Based on comprehensive UX/UI design resources and heuristics

export interface DesignPrinciple {
  id: string;
  category: string;
  name: string;
  description: string;
  checklist: string[];
  codeExamples?: string[];
  severity: 'critical' | 'important' | 'recommended';
}

export interface DesignCheck {
  id: string;
  principle: DesignPrinciple;
  check: (element: HTMLElement, context: any) => boolean;
  suggestion: (element: HTMLElement, context: any) => string;
  codeFix?: (element: HTMLElement, context: any) => string;
}

export class DesignBestPractices {
  private principles: DesignPrinciple[] = [
    // 1. Design System Principles
    {
      id: 'design-system-consistency',
      category: 'Design System',
      name: 'Component Consistency',
      description: 'Ensure components follow consistent design patterns and reuse established components',
      checklist: [
        'Use standardized components from design system',
        'Maintain consistent spacing and typography',
        'Follow established color palette',
        'Ensure component reusability'
      ],
      severity: 'critical'
    },
    {
      id: 'design-tokens',
      category: 'Design System',
      name: 'Design Tokens',
      description: 'Use design tokens for colors, spacing, typography, and other design values',
      checklist: [
        'Use CSS custom properties for colors',
        'Implement consistent spacing scale',
        'Standardize typography scale',
        'Maintain token documentation'
      ],
      severity: 'important'
    },

    // 2. Design Principles
    {
      id: 'clarity-simplicity',
      category: 'Design Principles',
      name: 'Clarity and Simplicity',
      description: 'Design should be clear, purposeful, and free of unnecessary elements',
      checklist: [
        'Remove unnecessary elements',
        'Clear visual hierarchy',
        'Purposeful design elements',
        'Minimal cognitive load'
      ],
      severity: 'critical'
    },
    {
      id: 'visual-hierarchy',
      category: 'Design Principles',
      name: 'Visual Hierarchy',
      description: 'Guide user attention through size, color, and whitespace',
      checklist: [
        'Clear heading structure',
        'Consistent typography scale',
        'Appropriate use of color',
        'Effective use of whitespace'
      ],
      severity: 'important'
    },
    {
      id: 'immediate-feedback',
      category: 'Design Principles',
      name: 'Immediate Feedback',
      description: 'Users need to see that their actions have been registered',
      checklist: [
        'Button state changes',
        'Loading indicators',
        'Success confirmations',
        'Clear error messages'
      ],
      severity: 'critical'
    },

    // 3. Usability Heuristics (Nielsen's 10)
    {
      id: 'system-status-visibility',
      category: 'Usability Heuristics',
      name: 'System Status Visibility',
      description: 'Keep users informed about what is going on through appropriate feedback',
      checklist: [
        'Loading states for actions',
        'Progress indicators',
        'Status messages',
        'Clear system feedback'
      ],
      severity: 'critical'
    },
    {
      id: 'user-control-freedom',
      category: 'Usability Heuristics',
      name: 'User Control and Freedom',
      description: 'Users should be able to undo/redo actions and exit easily',
      checklist: [
        'Cancel buttons on modals',
        'Back navigation',
        'Undo functionality',
        'Clear exit paths'
      ],
      severity: 'important'
    },
    {
      id: 'consistency-standards',
      category: 'Usability Heuristics',
      name: 'Consistency and Standards',
      description: 'Follow platform conventions and maintain internal consistency',
      checklist: [
        'Platform-specific patterns',
        'Internal consistency',
        'Standardized interactions',
        'Familiar conventions'
      ],
      severity: 'critical'
    },
    {
      id: 'error-prevention',
      category: 'Usability Heuristics',
      name: 'Error Prevention',
      description: 'Prevent errors and provide graceful error handling',
      checklist: [
        'Inline form validation',
        'Confirmation dialogs',
        'Clear error messages',
        'Prevent destructive actions'
      ],
      severity: 'important'
    },

    // 4. Cognitive Principles
    {
      id: 'cognitive-load',
      category: 'Cognitive Principles',
      name: 'Cognitive Load Management',
      description: 'Keep interfaces simple and avoid overwhelming users with choices',
      checklist: [
        'Limit options (7±2 rule)',
        'Group related items',
        'Highlight essential actions',
        'Progressive disclosure'
      ],
      severity: 'important'
    },
    {
      id: 'hick-law',
      category: 'Cognitive Principles',
      name: "Hick's Law",
      description: 'Decision time increases with the number and complexity of choices',
      checklist: [
        'Minimize choice options',
        'Simplify decision trees',
        'Clear default selections',
        'Streamlined workflows'
      ],
      severity: 'recommended'
    },
    {
      id: 'fitts-law',
      category: 'Cognitive Principles',
      name: "Fitts's Law",
      description: 'Target acquisition depends on size and distance',
      checklist: [
        'Adequate touch targets (44px+)',
        'Strategic button placement',
        'Reduced travel distance',
        'Larger targets for important actions'
      ],
      severity: 'important'
    },

    // 5. Accessibility Standards
    {
      id: 'color-contrast',
      category: 'Accessibility',
      name: 'Color Contrast',
      description: 'Ensure sufficient color contrast for text readability',
      checklist: [
        'WCAG 2.2 AA compliance',
        '4.5:1 ratio for normal text',
        '3:1 ratio for large text',
        'Color-independent information'
      ],
      severity: 'critical'
    },
    {
      id: 'keyboard-navigation',
      category: 'Accessibility',
      name: 'Keyboard Navigation',
      description: 'Ensure all interactive elements are keyboard accessible',
      checklist: [
        'Tab order logical',
        'Focus indicators visible',
        'Skip links available',
        'No keyboard traps'
      ],
      severity: 'critical'
    },
    {
      id: 'screen-reader-support',
      category: 'Accessibility',
      name: 'Screen Reader Support',
      description: 'Provide proper ARIA labels and semantic HTML',
      checklist: [
        'Semantic HTML elements',
        'ARIA labels and roles',
        'Alt text for images',
        'Descriptive link text'
      ],
      severity: 'important'
    },

    // 6. Responsive Design
    {
      id: 'mobile-first',
      category: 'Responsive Design',
      name: 'Mobile-First Design',
      description: 'Design for mobile users first, then enhance for larger screens',
      checklist: [
        'Touch-friendly targets',
        'Responsive breakpoints',
        'Mobile navigation patterns',
        'Optimized content layout'
      ],
      severity: 'important'
    },
    {
      id: 'touch-targets',
      category: 'Responsive Design',
      name: 'Touch Target Size',
      description: 'Ensure touch targets are large enough for mobile interaction',
      checklist: [
        'Minimum 44x44px targets',
        'Adequate spacing between targets',
        'Thumb-friendly placement',
        'Visual feedback on touch'
      ],
      severity: 'important'
    },

    // 7. Ethical Design
    {
      id: 'user-autonomy',
      category: 'Ethical Design',
      name: 'User Autonomy',
      description: 'Respect user control and avoid manipulative patterns',
      checklist: [
        'Clear privacy controls',
        'Opt-out options',
        'No dark patterns',
        'Transparent data usage'
      ],
      severity: 'important'
    },
    {
      id: 'inclusive-design',
      category: 'Ethical Design',
      name: 'Inclusive Design',
      description: 'Design for diverse users and avoid exclusionary patterns',
      checklist: [
        'Cultural sensitivity',
        'Language accessibility',
        'Diverse user representation',
        'Universal design principles'
      ],
      severity: 'recommended'
    }
  ];

  private checks: DesignCheck[] = [
    // Design System Checks
    {
      id: 'check-component-consistency',
      principle: this.principles[0], // design-system-consistency
      check: (element: HTMLElement, _context: any): boolean => {
        // Check if element uses consistent styling patterns
        const style = window.getComputedStyle(element);
        const hasConsistentSpacing = style.margin && style.padding;
        const hasConsistentTypography = style.fontFamily && style.fontSize;
        return Boolean(hasConsistentSpacing && hasConsistentTypography);
      },
      suggestion: (_element: HTMLElement) => {
        return `Use consistent design system components instead of custom styling`;
      }
    },

    // Usability Checks
    {
      id: 'check-touch-targets',
      principle: this.principles[12], // fitts-law
      check: (element: HTMLElement, _context: any) => {
        if (element.tagName.toLowerCase() === 'button' || element.tagName.toLowerCase() === 'a') {
          const rect = element.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        }
        return true;
      },
      suggestion: (_element: HTMLElement) => {
        return `Increase touch target size to at least 44x44px for better mobile usability`;
      },
      codeFix: (_element: HTMLElement) => {
        return `className="min-w-[44px] min-h-[44px] px-4 py-2"`;
      }
    },

    // Accessibility Checks
    {
      id: 'check-focus-indicators',
      principle: this.principles[15], // keyboard-navigation
      check: (element: HTMLElement, _context: any) => {
        const style = window.getComputedStyle(element);
        return style.outline !== 'none' || style.boxShadow !== 'none';
      },
      suggestion: (_element: HTMLElement) => {
        return `Add visible focus indicators for keyboard navigation`;
      },
      codeFix: (_element: HTMLElement) => {
        return `className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"`;
      }
    },

    // Cognitive Load Checks
    {
      id: 'check-cognitive-load',
      principle: this.principles[10], // cognitive-load
      check: (element: HTMLElement, _context: any) => {
        const children = element.children.length;
        return children <= 7; // Miller's Law: 7±2 items
      },
      suggestion: (_element: HTMLElement) => {
        return `Reduce cognitive load by limiting options to 7 or fewer items`;
      }
    }
  ];

  /**
   * Get all design principles
   */
  getAllPrinciples(): DesignPrinciple[] {
    return this.principles;
  }

  /**
   * Get principles by category
   */
  getPrinciplesByCategory(category: string): DesignPrinciple[] {
    return this.principles.filter(p => p.category === category);
  }

  /**
   * Get all design checks
   */
  getAllChecks(): DesignCheck[] {
    return this.checks;
  }

  /**
   * Run all design checks on an element
   */
  runChecks(element: HTMLElement, context: any = {}): Array<{
    check: DesignCheck;
    passed: boolean;
    suggestion: string;
    codeFix?: string;
  }> {
    return this.checks.map(check => {
      const passed = check.check(element, context);
      const suggestion = check.suggestion(element, context);
      const codeFix = check.codeFix ? check.codeFix(element, context) : undefined;

      return {
        check,
        passed,
        suggestion,
        codeFix
      };
    });
  }

  /**
   * Get design recommendations based on element type
   */
  getRecommendations(elementType: string): DesignPrinciple[] {
    const typeMap: Record<string, string[]> = {
      'button': ['design-system-consistency', 'fitts-law', 'keyboard-navigation'],
      'input': ['design-system-consistency', 'error-prevention', 'keyboard-navigation'],
      'form': ['cognitive-load', 'error-prevention', 'user-control-freedom'],
      'navigation': ['visual-hierarchy', 'consistency-standards', 'mobile-first'],
      'modal': ['user-control-freedom', 'system-status-visibility', 'keyboard-navigation']
    };

    const relevantIds = typeMap[elementType] || [];
    return this.principles.filter(p => relevantIds.includes(p.id));
  }

  /**
   * Generate code suggestions based on design principles
   */
  generateCodeSuggestions(element: HTMLElement, principle: DesignPrinciple): string {
    const suggestions: Record<string, string> = {
      'design-system-consistency': `
// Use design system component
<Button variant="primary" size="md">
  ${element.textContent}
</Button>`,
      'fitts-law': `
// Ensure adequate touch target size
className="min-w-[44px] min-h-[44px] px-4 py-2"`,
      'keyboard-navigation': `
// Add focus indicators
className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"`,
      'color-contrast': `
// Use high contrast colors
className="text-gray-900 bg-white border border-gray-300"`,
      'cognitive-load': `
// Group related items
<div className="space-y-4">
  {/* Group related form fields */}
</div>`
    };

    return suggestions[principle.id] || `// Apply ${principle.name} principles`;
  }
}

export const designBestPractices = new DesignBestPractices(); 