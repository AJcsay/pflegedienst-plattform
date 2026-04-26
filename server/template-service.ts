/**
 * Email Template Service
 * Handles CRUD operations for email templates
 */

import { getDb } from './db';
import { emailTemplates } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { EmailTemplate } from '../shared/email-template-types';

export async function createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<EmailTemplate> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const id = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await db.insert(emailTemplates).values({
    id,
    name: template.name,
    subject: template.subject,
    preheader: template.preheader,
    blocks: JSON.stringify(template.blocks),
    backgroundColor: template.backgroundColor,
    fontFamily: template.fontFamily,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any);

  const created = await getTemplate(id);
  if (!created) throw new Error('Failed to create template');
  return created;
}

export async function getTemplate(templateId: string): Promise<EmailTemplate | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.select().from(emailTemplates).where(eq(emailTemplates.id, templateId));

  if (result.length === 0) return null;
  return formatTemplate(result[0]);
}

export async function getAllTemplates(userId: string): Promise<EmailTemplate[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const results = await db.select().from(emailTemplates);

  return results.map(formatTemplate);
}

export async function updateTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (updates.name) updateData.name = updates.name;
  if (updates.subject) updateData.subject = updates.subject;
  if (updates.preheader) updateData.preheader = updates.preheader;
  if (updates.blocks) updateData.blocks = JSON.stringify(updates.blocks);
  if (updates.backgroundColor) updateData.backgroundColor = updates.backgroundColor;
  if (updates.fontFamily) updateData.fontFamily = updates.fontFamily;

  await db.update(emailTemplates)
    .set(updateData)
    .where(eq(emailTemplates.id, templateId));

  const updated = await getTemplate(templateId);
  if (!updated) throw new Error('Failed to update template');
  return updated;
}

export async function deleteTemplate(templateId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(emailTemplates)
    .where(eq(emailTemplates.id, templateId));

  return true;
}

export async function duplicateTemplate(templateId: string, userId: string): Promise<EmailTemplate> {
  if (!userId) throw new Error('User ID required');
  const original = await getTemplate(templateId);
  if (!original) {
    throw new Error('Template not found');
  }

  const newTemplate = await createTemplate({
    name: `${original.name} (Kopie)`,
    subject: original.subject,
    preheader: original.preheader,
    blocks: original.blocks,
    backgroundColor: original.backgroundColor,
    fontFamily: original.fontFamily,
  }, userId);

  return newTemplate;
}

function formatTemplate(row: any): EmailTemplate {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    preheader: row.preheader,
    blocks: typeof row.blocks === 'string' ? JSON.parse(row.blocks) : row.blocks,
    backgroundColor: row.backgroundColor,
    fontFamily: row.fontFamily,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
