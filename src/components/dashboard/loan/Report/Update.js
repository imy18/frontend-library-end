// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Update() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const { id_pelaporan } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setExpire(decoded.exp);
            getDetail(response.data.accessToken);
        } catch (error) {
            if (error.response) {
                navigate('/login');
            }
        }
    };

    const getDetail = async (token) => {
        try {
            const response = await axios.get(`http://localhost:5000/report/detail/${id_pelaporan}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDeskripsi(response.data.deskripsi);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/report/update/${id_pelaporan}`, {
                deskripsi
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 2000,   
                });

                setTimeout(() => {
                    navigate(-1);
                }, 2000);
        } catch (error) {
            console.error('Error updating data:', error);
            toast.error('Gagal memperbarui data!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-6">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-6xl">
                <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Perbarui Data Laporan</h1>
                    <div className="space-y-2">
                        <label className="block text-gray-700 text-sm font-bold mb-0">Deskripsi</label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            className="w-full h-32 p-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Deskripsi ..."
                        />
                    </div>

                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={handleUpdate}
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
                <ToastContainer />
            </div>
        </div>
    );
}

export default Update;