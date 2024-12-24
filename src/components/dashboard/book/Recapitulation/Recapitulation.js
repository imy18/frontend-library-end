// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Recapitulation = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2024');
  const [laporan, setLaporan] = useState(null);
  const [showLaporan, setShowLaporan] = useState(false);
  const [isLaporanDisplayed, setIsLaporanDisplayed] = useState(false);
  const [error, setError] = useState('');

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

  const getData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/peminjaman/${month}/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaporan(response.data);
      setShowLaporan(true);
      setIsLaporanDisplayed(true); 
      setError('');
    } catch (error) {
      console.error('Error fetching laporan:', error);
      setLaporan(null);
      setShowLaporan(false);
    }
  };

  const handleTampilkanLaporan = () => {
    if (!month || !year) {
      setError('Silakan pilih bulan dan tahun.');
    } else {
      setError('');
      getData();
    }
  };

  useEffect(() => {
    if (month && year && isLaporanDisplayed) {
      getData();
    }
  }, [month, year, isLaporanDisplayed]);

  const handleCloseLaporan = () => {
    setShowLaporan(false);
    setLaporan(null);
  };

  const handlePrint = () => {
    window.print(); 
  };

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const formatValue = (value) => (value ? value : '-');

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex flex-col items-center justify-center p-6 sm:p-12 pb-10 pt-10 sm:pt-12">
      <div className="w-full max-w-6xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center print:hidden">Rekapitulasi Buku</h1>
        <div className="mb-6 print:hidden">
        <div className="mt-6 mb-6 flex justify-start print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm"
          >
            Back
          </button>
        </div>
          <label className="block mb-2 text-sm font-medium text-gray-700 ">
            Pilih Bulan dan Tahun:
          </label>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="w-full sm:w-1/3">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={`w-full text-center p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium text-gray-600 rounded-sm text-xs sm:text-sm ${error && 'border-red-500'}`}
              >
                <option value="">Pilih Bulan</option>
                {months.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/3">
              <input
                type="number"
                placeholder="Tahun"
                value={year || ''}
                onChange={(e) => setYear(e.target.value)}
                className={`w-full p-2 text-center text-sm font-medium text-gray-600 border border-gray-300 rounded-sm text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && 'border-red-500'}`}
              />
            </div>

            <div className="w-full sm:w-1/3">
              <button
                onClick={handleTampilkanLaporan}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm"
              >
                Tampilkan Laporan
              </button>
            </div>
          </div>

          {error && <p className="mt-4 text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{error}</p>}
        </div>

        {showLaporan && laporan && (
          <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl sm:text-1xl font-bold mb-4 text-gray-800 text-center print:text-center">Laporan Bulan {months.find(m => m.value === month)?.label} Tahun {year}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 p-3 rounded-md shadow-inner">
              Total Buku: <span className="font-bold text-gray-500">{formatValue(laporan.totalBuku)}</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 p-3 rounded-md shadow-inner">
              Total Buku Dipinjam: <span className="font-bold text-gray-500">{formatValue(laporan.totalBukuDipinjam)}</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 bg-gray-100 p-3 rounded-md shadow-inner">
              Total Buku Rusak: <span className="font-bold text-gray-500">{formatValue(laporan.totalBukuRusak)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm w-full"
              >
                Print
              </button>
              <button
                onClick={handleCloseLaporan}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 font-medium text-xs sm:text-sm  rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}        
      </div>
    </div>
  );
};

export default Recapitulation;