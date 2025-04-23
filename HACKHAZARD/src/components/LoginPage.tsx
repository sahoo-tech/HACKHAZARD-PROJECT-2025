import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import StellarSdk from 'stellar-sdk';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleStellarLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Generate a new keypair for testing (in production, this would be from user's wallet)
      const keypair = StellarSdk.Keypair.random();
      const publicKey = keypair.publicKey();

      // Get challenge from server
      const challenge = await authService.getAuthChallenge(publicKey);

      // Sign the challenge
      const signature = keypair.sign(Buffer.from(challenge)).toString('base64');

      if (isRegistering) {
        // Register new user
        await authService.register(publicKey, username, email);
      }

      // Login
      const response = await authService.login(publicKey, signature);

      // Store the token
      localStorage.setItem('authToken', response.token);

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError('Failed to authenticate with Stellar. Please try again.');
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="error-message">{error}</div>}

        {isRegistering && (
          <>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </>
        )}

        <button
          className="stellar-button"
          onClick={handleStellarLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Connect with Stellar ${isRegistering ? 'and Register' : ''}`}
        </button>

        <p className="toggle-text">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            className="toggle-button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;