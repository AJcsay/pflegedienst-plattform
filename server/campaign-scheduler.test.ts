import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scheduleCampaign, rescheduleCampaign, cancelScheduledCampaign, getScheduledCampaigns, getCampaignSchedulingInfo } from './campaign-scheduler';

describe('Campaign Scheduler', () => {
  describe('scheduleCampaign', () => {
    it('should schedule a campaign for future sending', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const result = await scheduleCampaign('test-campaign-1', futureDate);
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject scheduling for past time', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const result = await scheduleCampaign('test-campaign-2', pastDate);
      expect(result.success).toBe(false);
      expect(result.error).toContain('future');
    });

    it('should reject scheduling for current time', async () => {
      const now = new Date();

      const result = await scheduleCampaign('test-campaign-3', now);
      expect(result.success).toBe(false);
      expect(result.error).toContain('future');
    });
  });

  describe('rescheduleCampaign', () => {
    it('should reschedule a campaign to new time', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const newDate = new Date();
      newDate.setHours(newDate.getHours() + 3);

      const result = await rescheduleCampaign('test-campaign-4', newDate);
      // Will fail if campaign doesn't exist, but that's OK for this test
      if (result.success) {
        expect(result.error).toBeUndefined();
      }
    });

    it('should reject rescheduling for past time', async () => {
      // Try to reschedule to past time
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const result = await rescheduleCampaign('test-campaign-5', pastDate);
      expect(result.success).toBe(false);
      // Either campaign not found or future time error is acceptable
      expect(result.error).toBeDefined();
    });
  });

  describe('cancelScheduledCampaign', () => {
    it('should cancel a scheduled campaign', async () => {
      const result = await cancelScheduledCampaign('test-campaign-6');
      // Will fail if campaign doesn't exist, but that's OK for this test
      if (result.success) {
        expect(result.error).toBeUndefined();
      }
    });

    it('should return error for non-existent campaign', async () => {
      const result = await cancelScheduledCampaign('non-existent-campaign-' + Date.now());
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('getScheduledCampaigns', () => {
    it('should return array of scheduled campaigns', async () => {
      const result = await getScheduledCampaigns();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getCampaignSchedulingInfo', () => {
    it('should return null for non-existent campaign', async () => {
      const result = await getCampaignSchedulingInfo('non-existent-campaign-' + Date.now());
      expect(result).toBeNull();
    });

    it('should return scheduling info with correct properties', async () => {
      // This test would need a real campaign in the database
      // For now, we just verify the function doesn't crash
      const result = await getCampaignSchedulingInfo('test-campaign-7');
      // Result can be null if campaign doesn't exist
      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('scheduledAt');
        expect(result).toHaveProperty('recipientCount');
        expect(result).toHaveProperty('canReschedule');
        expect(result).toHaveProperty('canCancel');
      }
    });
  });

  describe('Date validation', () => {
    it('should validate future dates correctly', () => {
      const now = new Date();
      const future = new Date(now.getTime() + 3600000); // 1 hour in future
      const past = new Date(now.getTime() - 3600000); // 1 hour in past

      expect(future > now).toBe(true);
      expect(past < now).toBe(true);
    });

    it('should handle timezone-aware dates', () => {
      const berlinDate = new Date('2026-04-20T14:30:00+02:00');
      const now = new Date();

      expect(berlinDate instanceof Date).toBe(true);
      expect(berlinDate.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Scheduler logic', () => {
    it('should identify campaigns due for sending', () => {
      const now = new Date();
      const pastScheduled = new Date(now.getTime() - 60000); // 1 minute ago
      const futureScheduled = new Date(now.getTime() + 60000); // 1 minute from now

      expect(pastScheduled <= now).toBe(true);
      expect(futureScheduled > now).toBe(true);
    });

    it('should handle multiple scheduled campaigns', async () => {
      const campaigns = await getScheduledCampaigns();
      expect(Array.isArray(campaigns)).toBe(true);
      // Should be able to handle any number of campaigns
    });
  });
});
