import { CaptureResult } from '@/types';

export class CaptureService {
  /**
   * Capture the current tab's screenshot and extract JSX source
   */
  async captureCurrentTab(): Promise<CaptureResult> {
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      // Capture screenshot
      const screenshot = await this.captureScreenshot(tab.id);
      
      // Extract JSX source
      const jsxSource = await this.extractJSXSource(tab.id);

      return {
        screenshot,
        jsxSource,
        url: tab.url || '',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Capture failed:', error);
      throw error;
    }
  }

  /**
   * Capture screenshot of the current tab
   */
  private async captureScreenshot(tabId: number): Promise<Blob> {
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(tabId, {
        format: 'png',
        quality: 100
      });

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw new Error('Failed to capture screenshot');
    }
  }

  /**
   * Extract JSX source from the current page
   */
  private async extractJSXSource(tabId: number): Promise<string> {
    try {
      // Inject content script to extract React component tree
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: this.extractReactComponents
      });

      if (results && results[0] && results[0].result) {
        return results[0].result as string;
      }

      return '';
    } catch (error) {
      console.error('JSX extraction failed:', error);
      return '';
    }
  }

  /**
   * Function to be injected into the page to extract React components
   */
  private extractReactComponents(): string {
    try {
      // Check if React DevTools are available
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        const renderers = hook.renderers;
        
        if (renderers && renderers.size > 0) {
          // Get the first renderer (usually React DOM)
          const renderer = renderers.values().next().value;
          if (renderer && renderer.getFiberRoots) {
            const roots = renderer.getFiberRoots();
            if (roots.size > 0) {
              // Extract component tree from the first root
              const root = roots.values().next().value;
              return this.serializeComponentTree(root.current);
            }
          }
        }
      }

      // Fallback: extract DOM structure
      return this.extractDOMStructure();
    } catch (error) {
      console.error('React component extraction failed:', error);
      return this.extractDOMStructure();
    }
  }

  /**
   * Serialize React component tree to JSX-like string
   */
  private serializeComponentTree(fiber: any): string {
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
        jsx += '  ' + this.serializeComponentTree(child);
        child = child.sibling;
      }
      jsx += `</${componentName}>`;
    } else {
      jsx += ' />';
    }

    return jsx;
  }

  /**
   * Fallback: Extract DOM structure as JSX
   */
  private extractDOMStructure(): string {
    const body = document.body;
    if (!body) return '';

    return this.domToJSX(body);
  }

  /**
   * Convert DOM element to JSX-like string
   */
  private domToJSX(element: Element, depth: number = 0): string {
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
        jsx += this.domToJSX(child, depth + 1) + '\n';
      });
      jsx += `${indent}</${tagName}>`;
    } else if (element.textContent?.trim()) {
      jsx += `>${element.textContent.trim()}</${tagName}>`;
    } else {
      jsx += ' />';
    }

    return jsx;
  }
}

export const captureService = new CaptureService(); 