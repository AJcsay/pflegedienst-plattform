/**
 * Tracking Routes for Email Analytics
 * Handles tracking pixel requests and click tracking
 */

import { Router, Request, Response } from 'express';
import { trackEmailOpen, trackEmailClick } from './email-analytics';

const router = Router();

/**
 * Track email open
 * GET /api/track/open?id=<recipientId>
 * Returns a 1x1 transparent GIF pixel
 */
router.get('/open', async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      // Return pixel even if ID is missing (don't expose tracking failures)
      return sendPixel(res);
    }

    // Track the open asynchronously (don't wait for response)
    trackEmailOpen(id).catch((error) => {
      console.error(`[Tracking] Failed to track open for ${id}:`, error);
    });

    // Return pixel immediately
    sendPixel(res);
  } catch (error) {
    console.error('[Tracking] Error in open handler:', error);
    // Return pixel even on error
    sendPixel(res);
  }
});

/**
 * Track email click and redirect
 * GET /api/track/click?id=<recipientId>&url=<targetUrl>
 * Tracks the click and redirects to target URL
 */
router.get('/click', async (req: Request, res: Response) => {
  try {
    const { id, url } = req.query;

    if (!id || typeof id !== 'string' || !url || typeof url !== 'string') {
      // Redirect to home if parameters are missing
      return res.redirect(process.env.VITE_FRONTEND_URL || 'https://curamain.de');
    }

    // Validate URL to prevent open redirect attacks
    if (!isValidRedirectUrl(url)) {
      console.warn(`[Tracking] Invalid redirect URL attempted: ${url}`);
      return res.redirect(process.env.VITE_FRONTEND_URL || 'https://curamain.de');
    }

    // Track the click asynchronously (don't wait for response)
    trackEmailClick(id).catch((error) => {
      console.error(`[Tracking] Failed to track click for ${id}:`, error);
    });

    // Redirect to target URL
    res.redirect(url);
  } catch (error) {
    console.error('[Tracking] Error in click handler:', error);
    // Redirect to home on error
    res.redirect(process.env.VITE_FRONTEND_URL || 'https://curamain.de');
  }
});

/**
 * Send a 1x1 transparent GIF pixel
 * Used for tracking opens
 */
function sendPixel(res: Response): void {
  // 1x1 transparent GIF
  const pixel = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
    0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
  ]);

  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Length', pixel.length);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(pixel);
}

/**
 * Validate redirect URL to prevent open redirect attacks
 * Only allows URLs that are:
 * - Absolute URLs with http/https protocol
 * - Same domain as configured frontend URL
 * - Relative URLs starting with /
 */
function isValidRedirectUrl(url: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/')) {
      return true;
    }

    // Parse the URL
    const parsedUrl = new URL(url);
    const frontendUrl = new URL(process.env.VITE_FRONTEND_URL || 'https://curamain.de');

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Allow same domain
    if (parsedUrl.hostname === frontendUrl.hostname) {
      return true;
    }

    // Allow common email client domains (for unsubscribe links, etc.)
    const allowedDomains = [
      'curamain.de',
      'www.curamain.de',
      'localhost',
      'localhost:3000',
    ];

    return allowedDomains.includes(parsedUrl.hostname);
  } catch {
    // If URL parsing fails, reject it
    return false;
  }
}

export default router;
