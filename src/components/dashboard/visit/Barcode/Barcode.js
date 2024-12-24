// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css'; 
import { QRCodeCanvas } from "qrcode.react";

const Barcode = () => {
    const url = "/form";
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

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

    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 px-4 py-8">
          <div className="bg-white shadow-4xl rounded-lg p-6 w-full max-w-md md:max-w-3xl lg:max-w-6xl text-center border border-gray-300 mx-auto mt-2">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">QR Code Kehadiran</h2>
                <div className="p-2 bg-gray-100 rounded-lg shadow-inner inline-block mb-6">
                    <QRCodeCanvas value={url} size={290} bgColor="#ffffff" fgColor="#333333" level="Q" />
                </div>
                <div className="text-left bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Cara Menggunakan:</h3>
                    <ul className="text-gray-600 text-sm list-disc list-inside">
                        <li>Buka aplikasi pemindai pada ponsel Anda.</li>
                        <li>Arahkan kamera ke QR code di atas.</li>
                        <li>Tap pada link yang muncul untuk membuka link ke form presensi.</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 max-w-6xl mx-auto">
                    <div className="w-full flex flex-col lg:flex-row justify-between mt-4 space-y-4 lg:space-y-0 lg:space-x-4 print:hidden ">
                    <button
                        onClick={handlePrint}
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Print
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Back
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Barcode;