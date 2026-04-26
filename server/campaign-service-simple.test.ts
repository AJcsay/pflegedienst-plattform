import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createCampaign,
  getCampaign,
  getAllCampaigns,
  updateCampaign,
  addAllSubscribersAsRecipients,
  sendCampaign,
  deleteCampaign,
  CreateCampaignInput,
} from './campaign-service-simple';

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

describe('Campaign Service', () => {
  const mockCampaignInput: CreateCampaignInput = {
    name: 'Test Campaign',
    subject: 'Test Subject',
    preheader: 'Test Preheader',
    htmlContent: '<p>Test HTML</p>',
    textContent: 'Test Text',
  };

  const mockCampaign = {
    id: 'test-campaign-id',
    name: 'Test Campaign',
    subject: 'Test Subject',
    preheader: 'Test Preheader',
    htmlContent: '<p>Test HTML</p>',
    textContent: 'Test Text',
    campaignType: 'custom',
    triggerType: 'manual',
    status: 'draft',
    createdBy: 1,
    recipientCount: 0,
    sentCount: 0,
    bounceCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('createCampaign', () => {
    it('should create a campaign with draft status', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockResolvedValue([{ insertId: 'new-campaign-id' }]),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await createCampaign(mockCampaignInput, 1);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error if database is not available', async () => {
      const { getDb } = await import('./db');
      (getDb as any).mockResolvedValue(null);

      await expect(createCampaign(mockCampaignInput, 1)).rejects.toThrow('Database not available');
    });
  });

  describe('getCampaign', () => {
    it('should retrieve a campaign by ID', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockCampaign]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getCampaign('test-campaign-id');

      expect(result.campaign).toEqual(mockCampaign);
      expect(result.recipients).toBeDefined();
    });

    it('should throw error if campaign not found', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      await expect(getCampaign('non-existent-id')).rejects.toThrow('Campaign not found');
    });
  });

  describe('getAllCampaigns', () => {
    it('should retrieve all campaigns', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([mockCampaign]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await getAllCampaigns();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual(mockCampaign);
    });
  });

  describe('updateCampaign', () => {
    it('should update campaign fields', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockCampaign]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const updateData = { name: 'Updated Campaign' };
      const result = await updateCampaign('test-campaign-id', updateData);

      expect(mockDb.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a draft campaign', async () => {
      const { getDb } = await import('./db');
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockCampaign]),
          }),
        }),
        delete: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      const result = await deleteCampaign('test-campaign-id');

      expect(result.success).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it('should throw error if campaign is not draft', async () => {
      const { getDb } = await import('./db');
      const sentCampaign = { ...mockCampaign, status: 'sent' };
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([sentCampaign]),
          }),
        }),
      };
      (getDb as any).mockResolvedValue(mockDb);

      await expect(deleteCampaign('test-campaign-id')).rejects.toThrow('Can only delete draft campaigns');
    });
  });
});
