import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import AIService from '../services/aiService';
import { auth } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required');
}

const aiService = new AIService({
  groqApiKey: process.env.GROQ_API_KEY
});

router.post('/generate', auth, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const response = await aiService.generateText(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error in text generation:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

router.post('/transcribe', auth, upload.single('audio'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Audio file is required' });
      return;
    }

    const transcription = await aiService.transcribeAudio(req.file.buffer);
    res.json({ transcription });
  } catch (error) {
    console.error('Error in audio transcription:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;