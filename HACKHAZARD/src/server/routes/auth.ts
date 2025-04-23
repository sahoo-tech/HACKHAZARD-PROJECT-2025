import express from 'express';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../../services/authService';
import type { Request, Response } from 'express';

const router = express.Router();

// In-memory storage for challenges (in production, use Redis or similar)
const challenges = new Map<string, { challenge: string; timestamp: number }>();

// In-memory user storage (in production, use a database)
const users = new Map<string, User>();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate a random challenge for authentication
router.get('/challenge/:publicKey', (req, res) => {
  const { publicKey } = req.params;
  const challenge = randomBytes(32).toString('base64');
  
  // Store the challenge with a timestamp
  challenges.set(publicKey, {
    challenge,
    timestamp: Date.now()
  });

  res.json({ challenge });
});

// Register a new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicKey, username, email } = req.body;

    if (users.has(publicKey)) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user: User = {
      publicKey,
      username,
      email,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    users.set(publicKey, user);

    const token = jwt.sign({ publicKey }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login with Stellar
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicKey } = req.body;

    const challengeData = challenges.get(publicKey);
    if (!challengeData) {
      res.status(400).json({ error: 'No challenge found for this public key' });
      return;
    }

    // Check if challenge is expired (5 minutes)
    if (Date.now() - challengeData.timestamp > 5 * 60 * 1000) {
      challenges.delete(publicKey);
      res.status(400).json({ error: 'Challenge expired' });
      return;
    }

    const user = users.get(publicKey);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    users.set(publicKey, user);

    // Generate JWT token
    const token = jwt.sign({ publicKey }, JWT_SECRET, { expiresIn: '24h' });

    // Clear the used challenge
    challenges.delete(publicKey);

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { publicKey: string };

    const user = users.get(decoded.publicKey);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (_req: Request, res: Response) => {
  // In a real implementation, you might want to invalidate the token
  // For now, we'll just send a success response
  res.json({ message: 'Logged out successfully' });
});

export default router;