import express from 'express';
import { User } from '../models/User';
import { auth, generateToken, verifyWalletSignature } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    
    const user = new User({
      username,
      email,
      password,
      walletAddress
    });

    await user.save();
    const token = generateToken(user);
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: 'Login failed' });
  }
});

// Wallet login/connect
router.post('/wallet-login', verifyWalletSignature, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    let user = await User.findOne({ walletAddress });

    if (!user) {
      // Create new user if wallet not registered
      user = new User({
        username: `user_${walletAddress.slice(0, 8)}`,
        email: `${walletAddress.slice(0, 8)}@wallet.user`,
        password: Math.random().toString(36),
        walletAddress
      });
      await user.save();
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'Wallet login failed' });
  }
});

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req: AuthRequest, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = req.user;
    updates.forEach(update => {
      if (user) {
        (user as any)[update] = req.body[update];
      }
    });

    if (user) {
      await user.save();
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

export const userRoutes = router;