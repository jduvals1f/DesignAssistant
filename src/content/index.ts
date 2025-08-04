// Content script for UX Refactor Assistant

console.log('UX Refactor Assistant content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch (request.type) {
    case 'EXTRACT_JSX':
      handleExtractJSX(sendResponse);
      return true;
      
    case 'ANALYZE_ELEMENTS':
      handleAnalyzeElements(sendResponse);
      return true;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

function handleExtractJSX(sendResponse: (response: any) => void) {
  try {
    const jsx = extractReactComponents();
    sendResponse({ 
      success: true, 
      jsx: jsx 
    });
  } catch (error) {
    console.error('JSX extraction failed:', error);
    sendResponse({ error: 'Failed to extract JSX' });
  }
}

function handleAnalyzeElements(sendResponse: (response: any) => void) {
  try {
    const analysis = analyzePageElements();
    sendResponse({ 
      success: true, 
      analysis: analysis 
    });
  } catch (error) {
    console.error('Element analysis failed:', error);
    sendResponse({ error: 'Failed to analyze elements' });
  }
}

function extractReactComponents(): string {
  // Try to extract React component tree if available
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const renderers = hook.renderers;
    
    if (renderers && renderers.size > 0) {
      const renderer = renderers.values().next().value;
      if (renderer && renderer.getFiberRoots) {
        const roots = renderer.getFiberRoots();
        if (roots.size > 0) {
          const root = roots.values().next().value;
          return serializeComponentTree(root.current);
        }
      }
    }
  }

  // Fallback to DOM structure
  return extractDOMStructure();
}

function serializeComponentTree(fiber: any): string {
  if (!fiber) return '';

  const componentName = fiber.type?.name || fiber.type?.displayName || 
                       (typeof fiber.type === 'string' ? fiber.type : 'Unknown');
  
  let jsx = `<${componentName}`;
  
  // Add props
  if (fiber.memoizedProps) {
    Object.entries(fiber.memoizedProps).forEach(([key, value]) => {
      if (key !== 'children' && value !== undefined) {
        if (typeof value === 'string') {
          jsx += ` ${key}="${value}"`;
        } else {
          jsx += ` ${key}={${JSON.stringify(value)}}`;
        }
      }
    });
  }

  // Add children
  let child = fiber.child;
  if (child) {
    jsx += '>\n';
    while (child) {
      jsx += '  ' + serializeComponentTree(child);
      child = child.sibling;
    }
    jsx += `</${componentName}>`;
  } else {
    jsx += ' />';
  }

  return jsx;
}

function extractDOMStructure(): string {
  const body = document.body;
  if (!body) return '';

  return domToJSX(body);
}

function domToJSX(element: Element, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  const tagName = element.tagName.toLowerCase();
  
  let jsx = `${indent}<${tagName}`;
  
  // Add attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name !== 'class') { // Handle className separately
      jsx += ` ${attr.name}="${attr.value}"`;
    }
  });

  // Add className
  if (element.className) {
    jsx += ` className="${element.className}"`;
  }

  // Handle children
  const children = Array.from(element.children);
  if (children.length > 0) {
    jsx += '>\n';
    children.forEach(child => {
      jsx += domToJSX(child, depth + 1) + '\n';
    });
    jsx += `${indent}</${tagName}>`;
  } else if (element.textContent?.trim()) {
    jsx += `>${element.textContent.trim()}</${tagName}>`;
  } else {
    jsx += ' />';
  }

  return jsx;
}

function analyzePageElements(): any {
  const elements = document.querySelectorAll('button, input, a, p, h1, h2, h3, h4, h5, h6, div, span');
  const analysis = {
    totalElements: elements.length,
    buttons: 0,
    inputs: 0,
    links: 0,
    headings: 0,
    paragraphs: 0,
    potentialIssues: []
  };

  elements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'button':
        analysis.buttons++;
        break;
      case 'input':
        analysis.inputs++;
        break;
      case 'a':
        analysis.links++;
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        analysis.headings++;
        break;
      case 'p':
        analysis.paragraphs++;
        break;
    }

    // Check for potential issues
    const issues = checkElementIssues(element);
    (analysis.potentialIssues as any[]).push(...issues);
  });

  return analysis;
}

function checkElementIssues(element: Element): any[] {
  const issues = [];
  const style = window.getComputedStyle(element);

  // Check for contrast issues
  const backgroundColor = style.backgroundColor;
  const color = style.color;
  
  if (backgroundColor && color && backgroundColor !== 'transparent') {
    const contrast = calculateContrast(backgroundColor, color);
    const isLargeText = isLargeTextElement(element);
    const requiredContrast = isLargeText ? 3.0 : 4.5;

    if (contrast < requiredContrast) {
      issues.push({
        type: 'contrast',
        severity: 'error',
        message: `Low contrast ratio: ${contrast.toFixed(2)}:1 (needs ${requiredContrast}:1)`,
        element: element.tagName.toLowerCase()
      });
    }
  }

  // Check for spacing issues
  const margin = parseFloat(style.margin) || 0;
  const padding = parseFloat(style.padding) || 0;
  
  if (margin > 0 || padding > 0) {
    const totalSpacing = margin + padding;
    const nearestSpacing = findNearestSpacing(totalSpacing, [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]);
    
    if (Math.abs(totalSpacing - nearestSpacing) > 2) {
      issues.push({
        type: 'spacing',
        severity: 'warn',
        message: `Inconsistent spacing: ${totalSpacing}px (suggest ${nearestSpacing}px)`,
        element: element.tagName.toLowerCase()
      });
    }
  }

  return issues;
}

function calculateContrast(bgColor: string, textColor: string): number {
  const bgLuminance = getLuminance(bgColor);
  const textLuminance = getLuminance(textColor);
  
  const lighter = Math.max(bgLuminance, textLuminance);
  const darker = Math.min(bgLuminance, textLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseColor(color: string): number[] | null {
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

function isLargeTextElement(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const fontWeight = parseInt(style.fontWeight) || 400;
  
  return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
}

function findNearestSpacing(value: number, spacingScale: number[]): number {
  return spacingScale.reduce((prev, curr) => 
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
} 