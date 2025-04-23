import { Groq } from 'groq-sdk';

interface AIServiceConfig {
  groqApiKey: string;
}

class AIService {
  private groqClient: Groq;

  constructor(config: AIServiceConfig) {
    this.groqClient = new Groq({
      apiKey: config.groqApiKey
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const completion = await this.groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Basic validation of the audio buffer
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('Invalid audio buffer provided');
      }
      
      console.log(`Received audio buffer of size: ${audioBuffer.length} bytes`);
      // For now, return a placeholder response since we haven't integrated
      // with a specific transcription service yet
      return 'Audio transcription will be implemented in future updates';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }
}

export default AIService;