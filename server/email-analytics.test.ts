import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  trackEmailOpen,
  trackEmailClick,
  getCampaignAnalytics,
  getAllCampaignsAnalytics,
  getEmailPerformanceMetrics,
  generateTrackingPixelUrl,
  generateTrackingLink,
} from './email-analytics';

// Mock the getDb function
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

describe('Email Analytics', () => {
  describe('trackEmailOpen', () => {
    it('should track email open', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await trackEmailOpen('recipient-1');

      expect(result.success).toBe(true);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should throw error if database is not available', async () => {
      const { getDb } = await import('./db');
      (getDb as any).mockResolvedValue(null);

      try {
        await trackEmailOpen('recipient-1');
        expect(true).toBe(false);
      } catch (error) {
        expect((error as Error).message).toBe('Database not available');
      }
    });
  });

  describe('trackEmailClick', () => {
    it('should track email click', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await trackEmailClick('recipient-1');

      expect(result.success).toBe(true);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should throw error if database is not available', async () => {
      const { getDb } = await import('./db');
      (getDb as any).mockResolvedValue(null);

      try {
        await trackEmailClick('recipient-1');
        expect(true).toBe(false);
      } catch (error) {
        expect((error as Error).message).toBe('Database not available');
      }
    });
  });

  describe('getCampaignAnalytics', () => {
    it('should calculate campaign analytics correctly', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([
              { id: '1', campaignId: 'campaign-1', status: 'sent' },
              { id: '2', campaignId: 'campaign-1', status: 'opened' },
              { id: '3', campaignId: 'campaign-1', status: 'clicked' },
              { id: '4', campaignId: 'campaign-1', status: 'bounced' },
            ]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getCampaignAnalytics('campaign-1');

      expect(result.totalRecipients).toBe(4);
      expect(result.sentCount).toBe(4);
      expect(result.openedCount).toBe(2);
      expect(result.clickedCount).toBe(1);
      expect(result.bouncedCount).toBe(1);
      expect(result.openRate).toBeGreaterThan(0);
      expect(result.clickRate).toBeGreaterThan(0);
      expect(result.bounceRate).toBeGreaterThan(0);
    });

    it('should handle empty campaign', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getCampaignAnalytics('campaign-1');

      expect(result.totalRecipients).toBe(0);
      expect(result.openRate).toBe(0);
      expect(result.clickRate).toBe(0);
    });
  });

  describe('getAllCampaignsAnalytics', () => {
    it('should calculate analytics for all campaigns', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockResolvedValue([
            { id: '1', campaignId: 'campaign-1', status: 'sent' },
            { id: '2', campaignId: 'campaign-1', status: 'opened' },
            { id: '3', campaignId: 'campaign-2', status: 'sent' },
            { id: '4', campaignId: 'campaign-2', status: 'clicked' },
          ]),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getAllCampaignsAnalytics();

      expect(result).toHaveLength(2);
      expect(result[0].campaignId).toBe('campaign-1');
      expect(result[1].campaignId).toBe('campaign-2');
    });

    it('should return empty array if no campaigns', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockResolvedValue([]),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getAllCampaignsAnalytics();

      expect(result).toHaveLength(0);
    });
  });

  describe('getEmailPerformanceMetrics', () => {
    it('should calculate overall performance metrics', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockResolvedValue([
            { id: '1', status: 'sent' },
            { id: '2', status: 'opened' },
            { id: '3', status: 'clicked' },
            { id: '4', status: 'bounced' },
          ]),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getEmailPerformanceMetrics();

      expect(result.totalEmails).toBe(4);
      expect(result.sentEmails).toBe(4);
      expect(result.openedEmails).toBe(2);
      expect(result.clickedEmails).toBe(1);
      expect(result.bouncedEmails).toBe(1);
    });
  });

  describe('generateTrackingPixelUrl', () => {
    it('should generate tracking pixel URL', () => {
      const url = generateTrackingPixelUrl('recipient-1', 'https://example.com');

      expect(url).toContain('/api/track/open');
      expect(url).toContain('recipient-1');
    });

    it('should use default base URL if not provided', () => {
      const url = generateTrackingPixelUrl('recipient-1');

      expect(url).toContain('/api/track/open');
      expect(url).toContain('recipient-1');
    });
  });

  describe('generateTrackingLink', () => {
    it('should generate tracking link', () => {
      const url = generateTrackingLink('recipient-1', 'https://example.com/page', 'https://base.com');

      expect(url).toContain('/api/track/click');
      expect(url).toContain('recipient-1');
      expect(url).toContain('url=');
    });

    it('should encode target URL', () => {
      const targetUrl = 'https://example.com/page?param=value';
      const url = generateTrackingLink('recipient-1', targetUrl);

      expect(url).toContain(encodeURIComponent(targetUrl));
    });
  });
});
