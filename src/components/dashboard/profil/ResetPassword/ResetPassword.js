// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const token = response.data.accessToken;
      const decoded = jwtDecode(token);
      setToken(token);
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/users/reset-password', {
        oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(response.data.message || 'Kata sandi berhasil diperbarui.', {
        position: "top-center",
        autoClose: 2000
        
      });
      setFormError(''); 
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setFormError(error.response.data.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-4 pt-12 pb-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-6xl mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ubah Kata Sandi</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
            ${formError === 'Password wajib diisi.' 
            || formError === 'Password yang Anda masukkan tidak valid.' ? 'border-red-500' : ''}`}
            placeholder="Password" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password Baru</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  
            ${formError === 'Password baru wajib diisi.' 
            || formError === 'Password baru tidak boleh sama dengan password lama.'  
            || formError === 'Password baru harus mengandung setidaknya satu angka.'  
            || formError === 'Password baru harus 8 atau lebih karakter.' 
            || formError === 'Password baru tidak boleh hanya terdiri dari angka.' 
            || formError === 'Password baru dan konfirmasi password baru tidak cocok.' ? 'border-red-500' : ''}`}
            placeholder="Password baru" 
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password Baru</label>
          <input 
            type="password" 
            value={confirmNewPassword} 
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
            ${formError === 'Konfirmasi password baru wajib diisi.'
            || formError === 'Password baru dan konfirmasi password baru tidak cocok.' ? 'border-red-500' : ''}`}
            placeholder="Konfirmasi password baru" 
          />
        </div>

        {formError && (
          <p className="text-white text-sm mb-4 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">
            {formError}
          </p>
        )}

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleSubmit} 
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Save
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ResetPassword;