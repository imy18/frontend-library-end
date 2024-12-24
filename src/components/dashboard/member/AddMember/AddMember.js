// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMember = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState(''); 
  const [expire, setExpire] = useState(0);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kelas: '',
    no_telepon: '',
    angkatan: '',
    jenis_kelamin: '',
    password: '',
    confPassword: '',
    role: ''
  });
    
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const token = response.data.accessToken;
      const decoded = jwtDecode(token);
      setToken(token);
      setExpire(decoded.exp);

      } catch (error) {
        if (error.response) {
          navigate('/login');
        }
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);
  
  const { 
    nama, 
    email, 
    kelas, 
    no_telepon, 
    angkatan, 
    jenis_kelamin, 
    password, 
    confPassword, 
    role 
  } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const res = await axios.post('http://localhost:5000/users/register/admin', formData, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log(res.data);
        setError('');
        toast.success('Data pengguna berhasil ditambahkan.', {
            position: "top-center",
            autoClose: 2000, 
            
          });

          setFormData({
            nama: '',
            email: '',
            kelas: '',
            no_telepon: '',
            angkatan: '',
            jenis_kelamin: '',
            password: '',
            confPassword: '',
            role: ''
          });

      
      } catch (err) {
        console.error(err.response.data);
        setError(err.response.data.msg);
      }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 py-12">  
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tambah Data Anggota</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
              <input 
              type="text" 
              id="nama" 
              name="nama"  
              value={nama} 
              onChange={handleChange} 
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${error === 'Nama lengkap wajib diisi.' ? 'border-red-500' : ''}`}
              placeholder="Nama Lengkap"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${error === 'Email wajib diisi.'  
                || error === 'Email sudah terdaftar oleh pengguna lain.'
                || error === 'Email yang Anda masukkan tidak valid.' ? 'border-red-500' : ''}`}
                placeholder="Email"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="no_telepon" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                <input 
                  type="text" 
                  id="no_telepon" 
                  name="no_telepon" 
                  value={no_telepon} 
                  onChange={(e) => {
                  const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      handleChange(e);
                    }
                  }}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                  ${error === 'Nomor telepon wajib diisi.' 
                  || error === 'Nomor telepon sudah terdaftar oleh pengguna lain.' ? 'border-red-500' : ''}`}
                  placeholder="Nomor WhatsApp"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
                <label htmlFor="kelas" className="block text-gray-700 text-sm font-bold mb-2">Kelas</label>
                <input 
                  type="text" 
                  id="kelas" 
                  name="kelas" 
                  value={kelas} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  placeholder="Kelas"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="angkatan" className="block text-gray-700 text-sm font-bold mb-2">Angkatan</label>
                <input 
                  type="text" 
                  id="angkatan" 
                  name="angkatan" 
                  value={angkatan} 
                  onChange={(e) => {
                  const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      handleChange(e);
                    }
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  placeholder="Angkatan"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <select 
                id="role" 
                name="role" 
                value={role} 
                onChange={handleChange} 
                className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${error === 'Role wajib dipilih.' ? 'border-red-500' : ''}`}
                >
                  <option value="">Pilih Role</option>
                  <option value="pustakawan">Pustakawan</option>
                  <option value="guru">Guru</option>
                  <option value="staf">Staf</option>
                  <option value="siswa">Siswa</option>
               </select>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password} 
                  onChange={handleChange} 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                  ${error === 'Password wajib diisi.'  
                  || error === 'Password harus 8 atau lebih karakter.' 
                  || error === 'Password harus mengandung setidaknya satu angka.' 
                  || error === 'Password tidak boleh hanya terdiri dari angka.' 
                  || error === 'Password dan konfirmasi password tidak cocok.' ? 'border-red-500' : ''}`}
                  placeholder="Password"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label htmlFor="confPassword" className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
                <input 
                  type="password" 
                  id="confPassword" 
                  name="confPassword" 
                  value={confPassword} 
                  onChange={handleChange} 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                  ${error === 'Konfirmasi password wajib diisi.' 
                  || error === 'Password dan konfirmasi password tidak cocok.' ? 'border-red-500' : ''}`}
                  placeholder="Konfirmasi Password"/>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer flex items-center">
                    <input
                      type="radio"
                      id="jenis_kelamin_laki"
                      name="jenis_kelamin"
                      value="Laki-laki"
                      checked={jenis_kelamin === 'Laki-laki'}
                      onChange={handleChange}
                      className="form-radio text-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Laki-laki</span>
                  </label>

                  <label className="cursor-pointer flex items-center">
                    <input
                    type="radio"
                    id="jenis_kelamin_perempuan"
                    name="jenis_kelamin"
                    value="Perempuan"
                    checked={jenis_kelamin === 'Perempuan'}
                    onChange={handleChange}
                    className="form-radio text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Perempuan</span>
                  </label>
                </div>
            </div>

            <div className="col-span-full space-y-4 mt-2">
              {error && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{error}</p>}
                {successMessage && <div className="bg-green-500 text-white p-3 rounded-md text-center">{successMessage}</div>}
                <div className="flex flex-col sm:flex-row gap-4">    
                  <button className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    type="submit">Save
                  </button>
                  <button className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    type="button" 
                    onClick={() => navigate(-1)}>Cancel
                  </button>
                </div>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    );
  };

  export default AddMember;