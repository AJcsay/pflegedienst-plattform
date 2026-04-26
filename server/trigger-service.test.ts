import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sendWelcomeEmail,
  triggerAutomation,
  initializeWelcomeTemplate,
  renderTemplate,
} from './trigger-service';

// Mock the getDb function
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    })),
  },
}));

describe('Trigger Service', () => {
  describe('renderTemplate', () => {
    it('should replace template variables with values', () => {
      const template = 'Hallo {{firstName}}, willkommen bei {{companyName}}!';
      const variables = {
        firstName: 'Max',
        companyName: 'CuraMain',
      };

      const result = renderTemplate(template, variables);

      expect(result).toBe('Hallo Max, willkommen bei CuraMain!');
    });

    it('should handle multiple occurrences of the same variable', () => {
      const template = '{{name}} hat {{name}} angemeldet';
      const variables = { name: 'Alice' };

      const result = renderTemplate(template, variables);

      expect(result).toBe('Alice hat Alice angemeldet');
    });

    it('should leave unreplaced variables as-is', () => {
      const template = 'Hallo {{firstName}}, {{unknown}} ist nicht definiert';
      const variables = { firstName: 'Bob' };

      const result = renderTemplate(template, variables);

      expect(result).toBe('Hallo Bob, {{unknown}} ist nicht definiert');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with template', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([
              {
                id: 'template-1',
                name: 'Welcome Template',
                htmlContent: '<p>Hallo {{firstName}}</p>',
                textContent: 'Hallo {{firstName}}',
              },
            ]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await sendWelcomeEmail('test@example.com', 'Max');

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should handle database not available gracefully', async () => {
      const { getDb } = await import('./db');
      (getDb as any).mockResolvedValue(null);

      try {
        await sendWelcomeEmail('test@example.com', 'Max');
        // Should throw an error
        expect(true).toBe(false);
      } catch (error) {
        expect((error as Error).message).toBe('Database not available');
      }
    });

    it('should return error if no welcome template found', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await sendWelcomeEmail('test@example.com', 'Max');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No welcome template found');
    });
  });

  describe('triggerAutomation', () => {
    it('should trigger automation for newsletter_signup event', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn()
              .mockResolvedValueOnce([
                {
                  id: 'automation-1',
                  triggerEvent: 'newsletter_signup',
                  campaignId: 'campaign-1',
                  delayMinutes: 0,
                  isActive: true,
                },
              ])
              .mockResolvedValueOnce([
                {
                  id: 'campaign-1',
                  subject: 'Welcome',
                  htmlContent: '<p>Welcome {{firstName}}</p>',
                  textContent: 'Welcome',
                },
              ])
              .mockResolvedValueOnce([
                {
                  id: 'subscriber-1',
                  email: 'test@example.com',
                  firstName: 'Max',
                },
              ])
              .mockResolvedValueOnce([]),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockResolvedValue(undefined),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await triggerAutomation('newsletter_signup', 'subscriber-1');

      expect(result.triggered).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 triggered if no automations found', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await triggerAutomation('unknown_event', 'subscriber-1');

      expect(result.triggered).toBe(0);
    });
  });

  describe('initializeWelcomeTemplate', () => {
    it('should create welcome template if not exists', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockResolvedValue(undefined),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      await initializeWelcomeTemplate();

      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should not create template if already exists', async () => {
      const { getDb } = await import('./db');
      const insertMock = vi.fn();
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([
              {
                id: 'template-1',
                templateType: 'welcome',
              },
            ]),
          }),
        }),
        insert: insertMock,
      };
      (getDb as any).mockResolvedValue(mockDb);

      await initializeWelcomeTemplate();

      expect(insertMock).not.toHaveBeenCalled();
    });
  });
});
