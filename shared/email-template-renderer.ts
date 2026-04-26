/**
 * Email Template to HTML Renderer
 * Converts template blocks to HTML email content
 */

import { EmailBlock, EmailTemplate, TextBlock, HeadingBlock, ButtonBlock, ImageBlock, DividerBlock, SpacerBlock, SectionBlock } from './email-template-types';

export function renderBlockToHtml(block: EmailBlock): string {
  switch (block.type) {
    case 'heading':
      return renderHeading(block as HeadingBlock);
    case 'text':
      return renderText(block as TextBlock);
    case 'button':
      return renderButton(block as ButtonBlock);
    case 'image':
      return renderImage(block as ImageBlock);
    case 'divider':
      return renderDivider(block as DividerBlock);
    case 'spacer':
      return renderSpacer(block as SpacerBlock);
    case 'section':
      return renderSection(block as SectionBlock);
    default:
      return '';
  }
}

function renderHeading(block: HeadingBlock): string {
  const tag = `h${block.level}`;
  return `
    <${tag} style="
      color: ${block.color};
      text-align: ${block.alignment};
      margin: 16px 0;
      font-family: Arial, sans-serif;
    ">
      ${escapeHtml(block.content)}
    </${tag}>
  `;
}

function renderText(block: TextBlock): string {
  return `
    <p style="
      color: ${block.color};
      font-size: ${block.fontSize}px;
      text-align: ${block.alignment};
      font-weight: ${block.fontWeight};
      margin: 12px 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    ">
      ${escapeHtml(block.content).replace(/\n/g, '<br>')}
    </p>
  `;
}

function renderButton(block: ButtonBlock): string {
  return `
    <div style="text-align: ${block.alignment}; margin: 16px 0;">
      <a href="${escapeHtml(block.url)}" style="
        display: inline-block;
        background-color: ${block.backgroundColor};
        color: ${block.textColor};
        padding: ${block.padding}px ${block.padding * 2}px;
        text-decoration: none;
        border-radius: ${block.borderRadius}px;
        font-family: Arial, sans-serif;
        font-weight: bold;
      ">
        ${escapeHtml(block.text)}
      </a>
    </div>
  `;
}

function renderImage(block: ImageBlock): string {
  return `
    <div style="text-align: ${block.alignment}; margin: 16px 0;">
      <img src="${escapeHtml(block.src)}" 
           alt="${escapeHtml(block.alt)}"
           width="${block.width}"
           height="${block.height}"
           style="max-width: 100%; height: auto; display: block;">
    </div>
  `;
}

function renderDivider(block: DividerBlock): string {
  return `
    <div style="
      margin: ${block.margin}px 0;
      border-top: ${block.height}px solid ${block.color};
    "></div>
  `;
}

function renderSpacer(block: SpacerBlock): string {
  return `<div style="height: ${block.height}px;"></div>`;
}

function renderSection(block: SectionBlock): string {
  const blocksHtml = block.blocks.map(b => renderBlockToHtml(b)).join('');
  return `
    <div style="
      background-color: ${block.backgroundColor};
      padding: ${block.padding}px;
      margin: 0;
    ">
      ${blocksHtml}
    </div>
  `;
}

export function templateToHtml(template: EmailTemplate): string {
  const blocksHtml = template.blocks.map(block => renderBlockToHtml(block)).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(template.subject)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${template.fontFamily}, Arial, sans-serif;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${template.backgroundColor};
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${blocksHtml}
  </div>
</body>
</html>
  `;
}

export function templateToPlainText(template: EmailTemplate): string {
  const lines: string[] = [];

  function extractText(block: EmailBlock): void {
    switch (block.type) {
      case 'heading':
      case 'text':
        lines.push((block as any).content);
        break;
      case 'button':
        lines.push(`${(block as ButtonBlock).text}: ${(block as ButtonBlock).url}`);
        break;
      case 'image':
        lines.push(`[Image: ${(block as ImageBlock).alt}]`);
        break;
      case 'section':
        (block as SectionBlock).blocks.forEach(b => extractText(b));
        break;
    }
  }

  template.blocks.forEach(block => extractText(block));
  return lines.join('\n\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
