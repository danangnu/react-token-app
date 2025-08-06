import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/register`, {
        name,
        email,
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const iconStyle =
    'w-5 h-5 text-gray-400 cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2';

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">
          Register <span role="img" aria-label="party">🎉</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                required
              />
              <span onClick={() => setShowPassword((prev) => !prev)} className={iconStyle}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-white mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                required
              />
              <span onClick={() => setShowConfirmPassword((prev) => !prev)} className={iconStyle}>
                {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
