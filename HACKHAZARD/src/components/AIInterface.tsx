import React, { useState } from 'react';
import './AIInterface.css';

interface AIResponse {
  text: string;
  timestamp: Date;
}

const AIInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();
      setResponses(prev => [...prev, { text: data.response, timestamp: new Date() }]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to transcribe audio');

      const data = await response.json();
      setResponses(prev => [...prev, { text: data.transcription, timestamp: new Date() }]);
      setAudioFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      interface SpeechRecognitionEvent {
        results: SpeechRecognitionResultList;
      }
      
      interface SpeechRecognition extends EventTarget {
        constructor: new () => SpeechRecognition;
        continuous: boolean;
        interimResults: boolean;
        start: () => void;
        stop: () => void;
        onstart: (() => void) | null;
        onend: (() => void) | null;
        onerror: ((event: { error: string }) => void) | null;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
      }
      
      const SpeechRecognition = (window as Window & typeof globalThis & { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition || (window as Window & typeof globalThis & { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition;
      const recognition = new (SpeechRecognition as new () => SpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        handlePromptSubmit({ preventDefault: () => {} } as React.FormEvent);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <div className="ai-interface">
      <h2>AI Assistant</h2>
      
      {responses.length === 0 && (
        <div className="welcome-section">
          <h3>Welcome to HACKHAZARD AI</h3>
          <p>How can I help you today?</p>
          <div className="quick-questions">
            <button onClick={() => setPrompt('What is HACKHAZARD?')}>What is HACKHAZARD?</button>
            <button onClick={() => setPrompt('How does the AI work?')}>How does the AI work?</button>
            <button onClick={() => setPrompt('What features are available?')}>What features are available?</button>
          </div>
        </div>
      )}
      
      <form onSubmit={handlePromptSubmit} className="prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          disabled={isLoading}
        />
        <div className="button-group">
          <button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={startVoiceRecognition}
            disabled={isLoading || isListening}
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            {isListening ? 'Listening...' : '🎤'}
          </button>
        </div>
      </form>

      <div className="audio-section">
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          disabled={isLoading}
        />
        <button
          onClick={handleTranscribe}
          disabled={isLoading || !audioFile}
        >
          {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </div>

      <div className="responses">
        {responses.map((response, index) => (
          <div key={index} className="response-item">
            <p>{response.text}</p>
            <small>{response.timestamp.toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInterface;