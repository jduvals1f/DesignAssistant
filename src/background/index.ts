// Background service worker for UX Refactor Assistant

chrome.runtime.onInstalled.addListener(() => {
  console.log('UX Refactor Assistant installed');
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.type) {
    case 'CAPTURE_TAB':
      handleCaptureTab(sender.tab?.id, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'ANALYZE_PAGE':
      handleAnalyzePage(sender.tab?.id, sendResponse);
      return true;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

async function handleCaptureTab(tabId: number | undefined, sendResponse: (response: any) => void) {
  if (!tabId) {
    sendResponse({ error: 'No tab ID provided' });
    return;
  }

  try {
    // Capture screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(tabId, {
      format: 'png',
      quality: 100
    });

    // Convert to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    sendResponse({ 
      success: true, 
      screenshot: blob,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Capture failed:', error);
    sendResponse({ error: 'Failed to capture screenshot' });
  }
}

async function handleAnalyzePage(tabId: number | undefined, sendResponse: (response: any) => void) {
  if (!tabId) {
    sendResponse({ error: 'No tab ID provided' });
    return;
  }

  try {
    // Inject content script to analyze the page
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // This function will be executed in the content script context
        return {
          url: window.location.href,
          title: document.title,
          elements: document.querySelectorAll('button, input, a, p, h1, h2, h3, h4, h5, h6').length
        };
      }
    });

    if (results && results[0] && results[0].result) {
      sendResponse({ 
        success: true, 
        data: results[0].result 
      });
    } else {
      sendResponse({ error: 'No analysis results' });
    }
  } catch (error) {
    console.error('Analysis failed:', error);
    sendResponse({ error: 'Failed to analyze page' });
  }
} 