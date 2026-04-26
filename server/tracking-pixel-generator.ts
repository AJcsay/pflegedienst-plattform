/**
 * Tracking Pixel Generator
 * Injects tracking pixels into email HTML to measure open rates
 */

/**
 * Generate a tracking pixel HTML element
 * @param recipientId - Unique recipient identifier
 * @param baseUrl - Base URL for tracking endpoint (e.g., https://curamain.de)
 * @returns HTML img tag with tracking pixel
 */
export function generateTrackingPixel(recipientId: string, baseUrl: string = process.env.VITE_FRONTEND_URL || 'https://curamain.de'): string {
  const trackingUrl = `${baseUrl}/api/track/open?id=${encodeURIComponent(recipientId)}`;
  
  return `<img src="${trackingUrl}" alt="" width="1" height="1" border="0" style="display:none;width:1px;height:1px;border:0;" />`;
}

/**
 * Inject tracking pixel into email HTML
 * Adds the pixel before the closing </body> tag, or at the end if no body tag exists
 * @param htmlContent - Original email HTML
 * @param recipientId - Unique recipient identifier
 * @param baseUrl - Base URL for tracking endpoint
 * @returns HTML with injected tracking pixel
 */
export function injectTrackingPixel(htmlContent: string, recipientId: string, baseUrl?: string): string {
  const trackingPixel = generateTrackingPixel(recipientId, baseUrl);
  
  // Try to inject before closing </body> tag
  if (htmlContent.includes('</body>')) {
    return htmlContent.replace('</body>', `${trackingPixel}</body>`);
  }
  
  // Try to inject before closing </html> tag
  if (htmlContent.includes('</html>')) {
    return htmlContent.replace('</html>', `${trackingPixel}</html>`);
  }
  
  // If no closing tags, append at the end
  return htmlContent + trackingPixel;
}

/**
 * Wrap a URL with tracking link
 * Redirects through tracking endpoint before going to final URL
 * @param recipientId - Unique recipient identifier
 * @param targetUrl - Final destination URL
 * @param baseUrl - Base URL for tracking endpoint
 * @returns Tracking URL that redirects to target
 */
export function wrapTrackingLink(recipientId: string, targetUrl: string, baseUrl: string = process.env.VITE_FRONTEND_URL || 'https://curamain.de'): string {
  return `${baseUrl}/api/track/click?id=${encodeURIComponent(recipientId)}&url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Replace all links in HTML with tracking links
 * Wraps all href attributes with tracking wrapper
 * @param htmlContent - Original email HTML
 * @param recipientId - Unique recipient identifier
 * @param baseUrl - Base URL for tracking endpoint
 * @returns HTML with wrapped links
 */
export function injectTrackingLinks(htmlContent: string, recipientId: string, baseUrl?: string): string {
  const baseUrlValue = baseUrl || process.env.VITE_FRONTEND_URL || 'https://curamain.de';
  
  // Match all href="..." patterns
  return htmlContent.replace(/href="([^"]*)"/g, (match, url) => {
    // Skip tracking links, anchors, and mailto links
    if (url.includes('/api/track/') || url.startsWith('#') || url.startsWith('mailto:')) {
      return match;
    }
    
    const trackingUrl = wrapTrackingLink(recipientId, url, baseUrlValue);
    return `href="${trackingUrl}"`;
  });
}

/**
 * Prepare email HTML with both tracking pixel and tracking links
 * @param htmlContent - Original email HTML
 * @param recipientId - Unique recipient identifier
 * @param baseUrl - Base URL for tracking endpoint
 * @returns HTML with tracking pixel and wrapped links
 */
export function prepareEmailWithTracking(htmlContent: string, recipientId: string, baseUrl?: string): string {
  // First inject tracking links
  let preparedHtml = injectTrackingLinks(htmlContent, recipientId, baseUrl);
  
  // Then inject tracking pixel
  preparedHtml = injectTrackingPixel(preparedHtml, recipientId, baseUrl);
  
  return preparedHtml;
}

/**
 * Prepare plain text email with tracking links only
 * (Plain text emails can't have tracking pixels)
 * @param textContent - Original email text
 * @param recipientId - Unique recipient identifier
 * @param baseUrl - Base URL for tracking endpoint
 * @returns Text with wrapped links
 */
export function prepareTextEmailWithTracking(textContent: string, recipientId: string, baseUrl?: string): string {
  const baseUrlValue = baseUrl || process.env.VITE_FRONTEND_URL || 'https://curamain.de';
  
  // Match URLs in plain text (simple pattern for common URL formats)
  return textContent.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    // Skip tracking links, anchors, and mailto links
    if (url.includes('/api/track/') || url.startsWith('mailto:')) {
      return url;
    }
    
    return wrapTrackingLink(recipientId, url, baseUrlValue);
  });
}
