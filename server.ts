import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type InquiryStatus = 'received' | 'in_review' | 'contacted' | 'completed' | 'archived';

export interface InquiryNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  description: string;
  serviceCategory?: string;
  budgetRange?: string;
  expectedTimeline?: string;
  submittedAt: string;
  updatedAt?: string;
  status: InquiryStatus;
  clientIp?: string;
  notes?: InquiryNote[];
}

// Memory & local file backed inquiry storage
const INQUIRIES_FILE = path.join(__dirname, '.inquiries_store.json');

function loadInquiries(): Inquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Could not load inquiries store:', err);
  }
  return [];
}

function saveInquiries(inquiries: Inquiry[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Could not save inquiry store:', err);
  }
}

// Simple in-memory rate limiter for public submissions
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (record.count >= 10) {
    return true;
  }
  record.count += 1;
  return false;
}

// Rate limiter for admin login to prevent brute force
const loginAttemptsMap = new Map<string, { count: number; resetAt: number }>();

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);
  if (!record || now > record.resetAt) {
    loginAttemptsMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (record.count >= 5) {
    return true;
  }
  record.count += 1;
  return false;
}

function resetLoginRateLimit(ip: string) {
  loginAttemptsMap.delete(ip);
}

// Admin configuration
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skg@admin2026';

// Active admin sessions: token -> { username, expiresAt }
const adminSessions = new Map<string, { username: string; expiresAt: number }>();

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  const session = adminSessions.get(token);

  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid.' });
  }

  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired. Please log in again.' });
  }

  // Extend session on activity (24 hours)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  (req as any).adminUser = session.username;
  next();
}

function sanitizeText(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '1mb' }));

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'SKG ENTERPRISES Official Web Service',
      version: '1.1.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Public: Project Inquiry Submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many project inquiries from this address. Please wait a few minutes before submitting another request.',
      });
    }

    const {
      name,
      email,
      description,
      serviceCategory,
      budgetRange,
      expectedTimeline,
      website_honeypot,
    } = req.body;

    if (website_honeypot) {
      return res.status(200).json({
        success: true,
        inquiryId: 'SKG-BOT-IGNORED',
        message: 'Inquiry processed.',
      });
    }

    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide your full name (minimum 2 characters).';
    } else if (name.trim().length > 100) {
      errors.name = 'Name must not exceed 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.description = 'Please describe your project or inquiry in at least 10 characters.';
    } else if (description.trim().length > 4000) {
      errors.description = 'Project description must not exceed 4,000 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed. Please check the highlighted fields.',
        fieldErrors: errors,
      });
    }

    const inquiryId = `SKG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newInquiry: Inquiry = {
      id: inquiryId,
      name: sanitizeText(name),
      email: email.trim().toLowerCase(),
      description: sanitizeText(description),
      serviceCategory: serviceCategory ? sanitizeText(serviceCategory) : undefined,
      budgetRange: budgetRange ? sanitizeText(budgetRange) : undefined,
      expectedTimeline: expectedTimeline ? sanitizeText(expectedTimeline) : undefined,
      submittedAt: new Date().toISOString(),
      status: 'received',
      clientIp: clientIp.includes(',') ? clientIp.split(',')[0].trim() : clientIp,
      notes: [],
    };

    const inquiries = loadInquiries();
    inquiries.unshift(newInquiry);
    if (inquiries.length > 500) {
      inquiries.length = 500;
    }
    saveInquiries(inquiries);

    console.log(`[SKG Lead Capture] Recorded inquiry ${inquiryId} from ${newInquiry.name} <${newInquiry.email}>`);

    return res.status(201).json({
      success: true,
      inquiryId,
      message: 'Your project inquiry has been received. Our team will review the details and reach out within 24–48 hours.',
      inquiry: {
        id: inquiryId,
        name: newInquiry.name,
        email: newInquiry.email,
        serviceCategory: newInquiry.serviceCategory,
        submittedAt: newInquiry.submittedAt,
        status: newInquiry.status,
      },
    });
  });

  // Public: Verify inquiry status endpoint
  app.get('/api/contact/verify/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const inquiries = loadInquiries();
    const found = inquiries.find((i) => i.id.toUpperCase() === id.toUpperCase());

    if (!found) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry reference ID not found.',
      });
    }

    return res.json({
      success: true,
      inquiry: {
        id: found.id,
        name: found.name,
        serviceCategory: found.serviceCategory || 'General Project',
        submittedAt: found.submittedAt,
        status: found.status,
      },
    });
  });

  // ==========================================
  // ADMIN API ROUTES
  // ==========================================

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (isLoginRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
      });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password/PIN are required.' });
    }

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      resetLoginRateLimit(clientIp);
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      adminSessions.set(token, { username: ADMIN_USERNAME, expiresAt });

      console.log(`[SKG Admin] Successful login for user '${ADMIN_USERNAME}' from IP ${clientIp}`);

      return res.json({
        success: true,
        token,
        username: ADMIN_USERNAME,
        expiresAt,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. Please verify your username and password/PIN.',
    });
  });

  // Verify Admin Token
  app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
    res.json({
      success: true,
      user: (req as any).adminUser,
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      adminSessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Get all inquiries (with stats & filter)
  app.get('/api/admin/inquiries', requireAdminAuth, (_req: Request, res: Response) => {
    const inquiries = loadInquiries();

    const stats = {
      total: inquiries.length,
      received: inquiries.filter((i) => i.status === 'received').length,
      in_review: inquiries.filter((i) => i.status === 'in_review').length,
      contacted: inquiries.filter((i) => i.status === 'contacted').length,
      completed: inquiries.filter((i) => i.status === 'completed').length,
      archived: inquiries.filter((i) => i.status === 'archived').length,
    };

    res.json({
      success: true,
      inquiries,
      stats,
    });
  });

  // Update inquiry status & add internal note
  app.patch('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, noteText } = req.body;
    const adminUser = (req as any).adminUser || 'Admin';

    const inquiries = loadInquiries();
    const index = inquiries.findIndex((i) => i.id.toUpperCase() === id.toUpperCase());

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' });
    }

    const inquiry = inquiries[index];
    const validStatuses: InquiryStatus[] = ['received', 'in_review', 'contacted', 'completed', 'archived'];

    if (status && validStatuses.includes(status)) {
      inquiry.status = status;
      inquiry.updatedAt = new Date().toISOString();
    }

    if (noteText && typeof noteText === 'string' && noteText.trim().length > 0) {
      if (!inquiry.notes) inquiry.notes = [];
      inquiry.notes.push({
        id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
        text: sanitizeText(noteText),
        author: adminUser,
        createdAt: new Date().toISOString(),
      });
      inquiry.updatedAt = new Date().toISOString();
    }

    inquiries[index] = inquiry;
    saveInquiries(inquiries);

    console.log(`[SKG Admin] Updated inquiry ${inquiry.id}: status=${inquiry.status}, notesCount=${inquiry.notes?.length || 0}`);

    return res.json({
      success: true,
      inquiry,
      message: 'Inquiry updated successfully.',
    });
  });

  // Delete / Archive an inquiry
  app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    let inquiries = loadInquiries();
    const existing = inquiries.find((i) => i.id.toUpperCase() === id.toUpperCase());

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' });
    }

    inquiries = inquiries.filter((i) => i.id.toUpperCase() !== id.toUpperCase());
    saveInquiries(inquiries);

    console.log(`[SKG Admin] Removed inquiry ${id}`);

    return res.json({
      success: true,
      message: `Inquiry ${id} was deleted successfully.`,
    });
  });

  // Vite integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    // Explicit SPA fallback for direct routes like /admin
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) return next();
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SKG ENTERPRISES] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
