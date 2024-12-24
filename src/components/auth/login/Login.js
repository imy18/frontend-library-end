// Code was written by Muhammad Sindida Hilmy

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!email.trim()) {
      setEmailError('Masukkan email.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Masukkan password.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        email: email,
        password: password
      });

      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Login gagal. Silakan coba lagi.');
      }
      console.error('Error saat login:', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center px-6 sm:px-6 lg:px-6 pt-12 sm:pt-6 pb-6 sm:pb-6">
      <div className="max-w-2xl w-full mx-auto mb-2">
        <div className="bg-white border rounded-md shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${emailError === 'Masukkan email.'
                || error === 'Email tidak ditemukan.' ? 'border-red-500' : ''}`}
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{emailError}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${passwordError === 'Masukkan password.'
                || error === 'Password salah.' ? 'border-red-500' : ''}`}
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{passwordError}</p>}
            </div>

            <div className="mb-4">
              {error && <p className="text-white text-sm mt-2 mb-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
              
              <div className="text-xs text-center mt-4">
                <span>Belum punya akun? </span>
                <a href="/register" className="text-blue-500 hover:text-blue-700">Register</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;