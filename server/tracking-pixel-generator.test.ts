import { describe, it, expect } from 'vitest';
import {
  generateTrackingPixel,
  injectTrackingPixel,
  wrapTrackingLink,
  injectTrackingLinks,
  prepareEmailWithTracking,
  prepareTextEmailWithTracking,
} from './tracking-pixel-generator';

describe('Tracking Pixel Generator', () => {
  const recipientId = 'test-recipient-123';
  const baseUrl = 'https://example.com';

  describe('generateTrackingPixel', () => {
    it('should generate a tracking pixel HTML element', () => {
      const pixel = generateTrackingPixel(recipientId, baseUrl);

      expect(pixel).toContain('<img');
      expect(pixel).toContain('src=');
      expect(pixel).toContain('/api/track/open');
      expect(pixel).toContain(recipientId);
      expect(pixel).toContain('width="1"');
      expect(pixel).toContain('height="1"');
      expect(pixel).toContain('display:none');
    });

    it('should URL-encode the recipient ID', () => {
      const specialId = 'test@example.com';
      const pixel = generateTrackingPixel(specialId, baseUrl);

      expect(pixel).toContain(encodeURIComponent(specialId));
    });

    it('should use default base URL if not provided', () => {
      const pixel = generateTrackingPixel(recipientId);

      expect(pixel).toContain('/api/track/open');
      expect(pixel).toContain(recipientId);
    });
  });

  describe('injectTrackingPixel', () => {
    it('should inject pixel before closing body tag', () => {
      const html = '<html><body>Content</body></html>';
      const result = injectTrackingPixel(html, recipientId, baseUrl);

      expect(result).toContain('Content<img');
      expect(result).toContain('</body>');
      expect(result).toContain('<img');
      expect(result).toContain('/api/track/open');
    });

    it('should inject pixel before closing html tag if no body tag', () => {
      const html = '<html>Content</html>';
      const result = injectTrackingPixel(html, recipientId, baseUrl);

      expect(result).toContain('Content<img');
      expect(result).toContain('</html>');
      expect(result).toContain('<img');
    });

    it('should append pixel at end if no closing tags', () => {
      const html = '<html>Content';
      const result = injectTrackingPixel(html, recipientId, baseUrl);

      expect(result).toContain('<html>Content');
      expect(result).toContain('<img');
      expect(result.endsWith('<img')).toBe(false);
    });
  });

  describe('wrapTrackingLink', () => {
    it('should wrap URL with tracking endpoint', () => {
      const targetUrl = 'https://example.com/page';
      const result = wrapTrackingLink(recipientId, targetUrl, baseUrl);

      expect(result).toContain('/api/track/click');
      expect(result).toContain(recipientId);
      expect(result).toContain(encodeURIComponent(targetUrl));
    });

    it('should URL-encode both recipient ID and target URL', () => {
      const specialId = 'test@example.com';
      const specialUrl = 'https://example.com/page?param=value&other=123';
      const result = wrapTrackingLink(specialId, specialUrl, baseUrl);

      expect(result).toContain(encodeURIComponent(specialId));
      expect(result).toContain(encodeURIComponent(specialUrl));
    });

    it('should use default base URL if not provided', () => {
      const targetUrl = 'https://example.com/page';
      const result = wrapTrackingLink(recipientId, targetUrl);

      expect(result).toContain('/api/track/click');
      expect(result).toContain(recipientId);
    });
  });

  describe('injectTrackingLinks', () => {
    it('should wrap all href attributes', () => {
      const html = '<html><body><a href="https://example.com/page1">Link 1</a><a href="https://example.com/page2">Link 2</a></body></html>';
      const result = injectTrackingLinks(html, recipientId, baseUrl);

      expect(result).toContain('/api/track/click');
      expect((result.match(/\/api\/track\/click/g) || []).length).toBe(2);
    });

    it('should skip tracking links', () => {
      const html = '<html><body><a href="/api/track/click?id=test&url=http%3A%2F%2Fexample.com">Already Tracked</a></body></html>';
      const result = injectTrackingLinks(html, recipientId, baseUrl);

      expect((result.match(/\/api\/track\/click/g) || []).length).toBe(1);
    });

    it('should skip anchor links', () => {
      const html = '<html><body><a href="#section">Anchor</a></body></html>';
      const result = injectTrackingLinks(html, recipientId, baseUrl);

      expect(result).toContain('href="#section"');
      expect(result).not.toContain('/api/track/click');
    });

    it('should skip mailto links', () => {
      const html = '<html><body><a href="mailto:test@example.com">Email</a></body></html>';
      const result = injectTrackingLinks(html, recipientId, baseUrl);

      expect(result).toContain('href="mailto:test@example.com"');
      expect(result).not.toContain('/api/track/click');
    });
  });

  describe('prepareEmailWithTracking', () => {
    it('should inject both tracking pixel and links', () => {
      const html = '<html><body>Content with <a href="https://example.com/page">link</a></body></html>';
      const result = prepareEmailWithTracking(html, recipientId, baseUrl);

      expect(result).toContain('/api/track/open');
      expect(result).toContain('/api/track/click');
      expect(result).toContain('<img');
    });

    it('should preserve email content', () => {
      const html = '<html><body>Important content here</body></html>';
      const result = prepareEmailWithTracking(html, recipientId, baseUrl);

      expect(result).toContain('Important content here');
    });

    it('should handle complex HTML', () => {
      const html = `
        <html>
          <head><title>Email</title></head>
          <body>
            <h1>Welcome</h1>
            <p>Click <a href="https://example.com/confirm">here</a> to confirm</p>
            <footer><a href="https://example.com/unsubscribe">Unsubscribe</a></footer>
          </body>
        </html>
      `;
      const result = prepareEmailWithTracking(html, recipientId, baseUrl);

      expect(result).toContain('Welcome');
      expect(result).toContain('/api/track/click');
      expect(result).toContain('/api/track/open');
      expect((result.match(/\/api\/track\/click/g) || []).length).toBe(2);
    });
  });

  describe('prepareTextEmailWithTracking', () => {
    it('should wrap URLs in plain text', () => {
      const text = 'Visit https://example.com/page for more info';
      const result = prepareTextEmailWithTracking(text, recipientId, baseUrl);

      expect(result).toContain('/api/track/click');
      expect(result).toContain(encodeURIComponent('https://example.com/page'));
    });

    it('should handle multiple URLs', () => {
      const text = 'Visit https://example.com/page1 or https://example.com/page2';
      const result = prepareTextEmailWithTracking(text, recipientId, baseUrl);

      expect((result.match(/\/api\/track\/click/g) || []).length).toBe(2);
    });

    it('should skip mailto links', () => {
      const text = 'Contact us at mailto:test@example.com';
      const result = prepareTextEmailWithTracking(text, recipientId, baseUrl);

      expect(result).toContain('mailto:test@example.com');
      expect(result).not.toContain('/api/track/click');
    });

    it('should preserve text content', () => {
      const text = 'Important message with https://example.com/link';
      const result = prepareTextEmailWithTracking(text, recipientId, baseUrl);

      expect(result).toContain('Important message with');
    });
  });
});
