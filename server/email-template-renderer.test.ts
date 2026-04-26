import { describe, it, expect } from 'vitest';
import { templateToHtml, templateToPlainText } from '../shared/email-template-renderer';
import { EmailTemplate } from '../shared/email-template-types';

describe('Email Template Renderer', () => {
  const mockTemplate: EmailTemplate = {
    id: 'template-1',
    name: 'Test Template',
    subject: 'Test Subject',
    preheader: 'Test Preheader',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial',
    createdAt: new Date(),
    updatedAt: new Date(),
    blocks: [
      {
        id: 'block-1',
        type: 'heading',
        content: 'Welcome',
        level: 1,
        color: '#000000',
        alignment: 'center',
      },
      {
        id: 'block-2',
        type: 'text',
        content: 'This is a test email',
        fontSize: 16,
        color: '#333333',
        alignment: 'left',
        fontWeight: 'normal',
      },
      {
        id: 'block-3',
        type: 'button',
        text: 'Click Here',
        url: 'https://example.com',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderRadius: 4,
        padding: 12,
        alignment: 'center',
      },
    ],
  };

  describe('templateToHtml', () => {
    it('should generate valid HTML', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
      expect(html).toContain(mockTemplate.subject);
    });

    it('should include all blocks in HTML', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('Welcome');
      expect(html).toContain('This is a test email');
      expect(html).toContain('Click Here');
    });

    it('should include heading tags', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('<h1');
      expect(html).toContain('</h1>');
    });

    it('should include button link', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('https://example.com');
      expect(html).toContain('Click Here');
    });

    it('should include background color', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('#ffffff');
    });

    it('should include font family', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('Arial');
    });

    it('should handle empty blocks', () => {
      const emptyTemplate: EmailTemplate = {
        ...mockTemplate,
        blocks: [],
      };
      const html = templateToHtml(emptyTemplate);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
    });

    it('should escape HTML special characters', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'text',
            content: '<script>alert("xss")</script>',
            fontSize: 16,
            color: '#000000',
            alignment: 'left',
            fontWeight: 'normal',
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).not.toContain('<script>');
    });
  });

  describe('templateToPlainText', () => {
    it('should generate plain text', () => {
      const text = templateToPlainText(mockTemplate);
      expect(text).toContain('Welcome');
      expect(text).toContain('This is a test email');
    });

    it('should include button text and URL', () => {
      const text = templateToPlainText(mockTemplate);
      expect(text).toContain('Click Here');
      expect(text).toContain('https://example.com');
    });

    it('should handle empty blocks', () => {
      const emptyTemplate: EmailTemplate = {
        ...mockTemplate,
        blocks: [],
      };
      const text = templateToPlainText(emptyTemplate);
      expect(text).toBe('');
    });

    it('should separate blocks with double newlines', () => {
      const text = templateToPlainText(mockTemplate);
      const lines = text.split('\n\n');
      expect(lines.length).toBeGreaterThan(1);
    });
  });

  describe('Block rendering', () => {
    it('should render heading with correct level', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'heading',
            content: 'H2 Heading',
            level: 2,
            color: '#000000',
            alignment: 'left',
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).toContain('<h2');
      expect(html).toContain('H2 Heading');
    });

    it('should render text with styling', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'text',
            content: 'Styled text',
            fontSize: 20,
            color: '#ff0000',
            alignment: 'center',
            fontWeight: 'bold',
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).toContain('20px');
      expect(html).toContain('#ff0000');
      expect(html).toContain('bold');
      expect(html).toContain('center');
    });

    it('should render divider', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'divider',
            color: '#cccccc',
            height: 2,
            margin: 16,
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).toContain('border-top');
      expect(html).toContain('#cccccc');
    });

    it('should render spacer', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'spacer',
            height: 30,
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).toContain('30px');
    });

    it('should render image', () => {
      const template: EmailTemplate = {
        ...mockTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'image',
            src: 'https://example.com/image.jpg',
            alt: 'Test Image',
            width: 300,
            height: 200,
            alignment: 'center',
          },
        ],
      };
      const html = templateToHtml(template);
      expect(html).toContain('https://example.com/image.jpg');
      expect(html).toContain('Test Image');
      expect(html).toContain('300');
      expect(html).toContain('200');
    });
  });

  describe('Template structure', () => {
    it('should include DOCTYPE', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toMatch(/<!DOCTYPE html>/i);
    });

    it('should include meta tags', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('charset="UTF-8"');
      expect(html).toContain('viewport');
    });

    it('should have proper HTML structure', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('</head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
    });

    it('should include email container', () => {
      const html = templateToHtml(mockTemplate);
      expect(html).toContain('email-container');
      expect(html).toContain('max-width: 600px');
    });
  });
});
