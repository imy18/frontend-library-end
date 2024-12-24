// Code was written by Muhammad Sindida Hilmy

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        kelas: '',
        no_telepon: '',
        angkatan: '',
        jenis_kelamin: '',
        password: '',
        confPassword: ''
    });
    const [error, setError] = useState('');
    const { nama, email, kelas, no_telepon, angkatan, jenis_kelamin, password, confPassword } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/users/register', formData);
            console.log(res.data);
            setError('');
            
            toast.success('Registrasi berhasil.', {
                position: "top-center",
                autoClose: 2000,
              });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error(err.response.data);
            setError(err.response.data.msg);
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center px-6 sm:px-6 lg:px-6 pt-12 sm:pt-6 pb-6 sm:pb-6">
            <div className="max-w-2xl w-full mx-auto mb-2">
                <div className="bg-white border rounded-md shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                                <input type="text" id="nama" name="nama" value={nama} onChange={handleChange} 
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline1
                                ${error === 'Nama wajib diisi.'? 'border-red-500' : ''}`}
                                placeholder="Nama Lengkap"/>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input type="email" id="email" name="email" value={email} onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Email wajib diisi.'
                                || error === 'Email sudah terdaftar oleh pengguna lain.'
                                || error === 'Email yang Anda masukkan tidak valid.' ? 'border-red-500' : ''}`}
                                placeholder="Email"/>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="no_telepon" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                                <input type="text" id="no_telepon" name="no_telepon" value={no_telepon} onChange={(e) => {
                                    const value = e.target.value;
                                    // Hanya izinkan angka (0-9)
                                    if (/^\d*$/.test(value)) {
                                        handleChange(e);
                                    }
                                }}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Nomor telepon wajib diisi.'
                                || error === 'Nomor telepon sudah terdaftar oleh pengguna lain.' ? 'border-red-500' : ''}`} 
                                placeholder="Nomor Whatsapp"/>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label htmlFor="kelas" className="block text-gray-700 text-sm font-bold mb-2">Kelas</label>
                                <input type="text" id="kelas" name="kelas" value={kelas} onChange={handleChange} 
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Kelas wajib diisi.' ? 'border-red-500' : ''}`}
                                placeholder="Kelas"/>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="angkatan" className="block text-gray-700 text-sm font-bold mb-2">Angkatan</label>
                                <input type="text" id="angkatan" name="angkatan" value={angkatan} onChange={(e) => {
                                    const value = e.target.value;
                                    // Hanya izinkan angka (0-9)
                                    if (/^\d*$/.test(value)) {
                                        handleChange(e);
                                    }
                                }}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Angkatan wajib diisi.' ? 'border-red-500' : ''}`}
                                placeholder="Angkatan"/>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                                <div>
                                    <label className="cursor-pointer inline-flex items-center">
                                        <input
                                        type="radio"
                                        id="jenis_kelamin_laki"
                                        name="jenis_kelamin"
                                        value="Laki-laki"
                                        checked={jenis_kelamin === 'Laki-laki'}
                                        onChange={handleChange}
                                        className="form-radio text-blue-500"
                                        />
                                        <span className="ml-2">Laki-laki</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="cursor-pointer inline-flex items-center mt-2">
                                        <input
                                        type="radio"
                                        id="jenis_kelamin_perempuan"
                                        name="jenis_kelamin"
                                        value="Perempuan"
                                        checked={jenis_kelamin === 'Perempuan'}
                                        onChange={handleChange}
                                        className="form-radio text-blue-500"
                                        />
                                        <span className="ml-2">Perempuan</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <input type="password" id="password" name="password" value={password} onChange={handleChange} 
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Password wajib diisi.'
                                || error === 'Password harus 8 atau lebih karakter.'
                                || error === 'Password harus mengandung setidaknya satu angka.'
                                || error === 'Password tidak boleh hanya terdiri dari angka.'
                                || error === 'Password dan Konfirmasi Password tidak sama.' ? 'border-red-500' : ''}`}
                                placeholder="Password"  />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confPassword" className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
                                <input type="password" id="confPassword" name="confPassword" value={confPassword} onChange={handleChange} 
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Konfirmasi password wajib diisi.'
                                || error === 'Password dan Konfirmasi Password tidak sama.' ? 'border-red-500' : ''}`}
                                placeholder="Konfirmasi password" />
                            </div>
                        </div>
                    
                        <div className="col-span-1 sm:col-span-2 md:col-span-3">
                            {error &&
                            <div className="text-white text-sm mb-2 bg-red-500 bg-opacity-50 p-2 rounded text-center" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>}
                                
                            <button  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                                type="submit">Register
                            </button>
                    
                            <div className="text-xs text-center mt-4">Sudah punya akun? <a href="/login" className="text-blue-500 hover:text-blue-700">Login</a></div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer /> 
        </div>
    );
};

export default RegisterForm;