/**
 * Email Template Block System
 * Defines the structure and types for email template blocks
 */

export type BlockType = 'heading' | 'text' | 'button' | 'image' | 'divider' | 'spacer' | 'section';

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
}

export interface HeadingBlock {
  id: string;
  type: 'heading';
  content: string;
  level: 1 | 2 | 3;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ButtonBlock {
  id: string;
  type: 'button';
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  padding: number;
  alignment: 'left' | 'center' | 'right';
}

export interface ImageBlock {
  id: string;
  type: 'image';
  src: string;
  alt: string;
  width: number;
  height: number;
  alignment: 'left' | 'center' | 'right';
}

export interface DividerBlock {
  id: string;
  type: 'divider';
  color: string;
  height: number;
  margin: number;
}

export interface SpacerBlock {
  id: string;
  type: 'spacer';
  height: number;
}

export interface SectionBlock {
  id: string;
  type: 'section';
  backgroundColor: string;
  padding: number;
  blocks: EmailBlock[];
}

export type EmailBlock = any;

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  blocks: EmailBlock[];
  backgroundColor: string;
  fontFamily: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockConfig {
  type: BlockType;
  label: string;
  icon: string;
  defaultProps: any;
}

export const BLOCK_CONFIGS: Record<BlockType, any> = {
  heading: {
    type: 'heading',
    label: 'Überschrift',
    icon: 'Heading2',
    defaultProps: {
      type: 'heading',
      content: 'Überschrift',
      level: 2,
      color: '#000000',
      alignment: 'left',
    },
  },
  text: {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    defaultProps: {
      type: 'text',
      content: 'Klicken Sie hier, um Text zu bearbeiten',
      fontSize: 16,
      color: '#333333',
      alignment: 'left',
      fontWeight: 'normal',
    },
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: 'ClickIcon',
    defaultProps: {
      type: 'button',
      text: 'Klicken Sie hier',
      url: 'https://example.com',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: 4,
      padding: 12,
      alignment: 'center',
    },
  },
  image: {
    type: 'image',
    label: 'Bild',
    icon: 'Image',
    defaultProps: {
      type: 'image',
      src: '',
      alt: 'Bild',
      width: 300,
      height: 200,
      alignment: 'center',
    },
  },
  divider: {
    type: 'divider',
    label: 'Trennlinie',
    icon: 'Minus',
    defaultProps: {
      type: 'divider',
      color: '#cccccc',
      height: 1,
      margin: 16,
    },
  },
  spacer: {
    type: 'spacer',
    label: 'Abstand',
    icon: 'Square',
    defaultProps: {
      type: 'spacer',
      height: 20,
    },
  },
  section: {
    type: 'section',
    label: 'Sektion',
    icon: 'Layout',
    defaultProps: {
      type: 'section',
      backgroundColor: '#ffffff',
      padding: 20,
      blocks: [],
    },
  },
};
