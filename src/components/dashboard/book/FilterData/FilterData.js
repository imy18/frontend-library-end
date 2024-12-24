// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function FilterData() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [filter, setFilter] = useState({
        bahasa: "",
        kategori: "",
        status_ketersediaan: "",
        lokasi_penyimpanan: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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
    }

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Set filter value yang diubah
        const newFilter = {
            ...filter,
            [name]: value
        };

        // Set dropdown lainnya ke default jika salah satu dipilih
        if (value) {
            for (const key in newFilter) {
                if (key !== name) {
                    newFilter[key] = ""; // Reset dropdown lainnya
                }
            }
        }

        setFilter(newFilter);
    };

    const getData = async () => {
        try {
            const query = Object.entries(filter)
                .filter(([key, value]) => value !== "")
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join("&");

            const response = await axios.get(`http://localhost:5000/buku/filter?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(response.data.filter);
            setTotalBooks(response.data.totalBooks);
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        if (token) {
            getData();
        }
    }, [filter, token]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-200 text-center">Filter Data Buku</h1>
          <div className="mt-6 bg-white p-6 border border-gray-300 rounded-lg shadow-lg mb-6 max-w-6xl mx-auto">
                <div className="flex justify-start mb-4">
                <button type="button" onClick={() => navigate(-1)} className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm">
                        Back
                    </button> 
                </div> 

                <div className="flex flex-col sm:flex-row">
                    {/* Filter Bahasa */}
                    <div className="w-full sm:w-1/4 p-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Bahasa:</label>
                        <select
                            name="bahasa"
                            value={filter.bahasa}
                            onChange={handleFilterChange}
                           className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                        >
                            <option value="">Semua Bahasa</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Inggris">Inggris</option>
                        </select>
                    </div>
    
                    {/* Filter Kategori */}
                    <div className="w-full sm:w-1/4 p-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Kategori:</label>
                        <select
                            name="kategori"
                            value={filter.kategori}
                            onChange={handleFilterChange}
                            className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="Kurikulum">Kurikulum</option>
                            <option value="Fiksi">Fiksi</option>
                            <option value="Nonfiksi">Nonfiksi</option>
                        </select>
                    </div>
    
                    {/* Filter Status Ketersediaan */}
                    <div className="w-full sm:w-1/4 p-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Status Ketersediaan:</label>
                        <select
                            name="status_ketersediaan"
                            value={filter.status_ketersediaan}
                            onChange={handleFilterChange}
                            className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="Tersedia">Tersedia</option>
                            <option value="Tidak Tersedia">Tidak Tersedia</option>
                        </select>
                    </div>
    
                    {/* Filter Lokasi Penyimpanan */}
                    <div className="w-full sm:w-1/4 p-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Lokasi Penyimpanan:</label>
                        <select
                            name="lokasi_penyimpanan"
                            value={filter.lokasi_penyimpanan}
                            onChange={handleFilterChange}
                            className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                        >
                            <option value="">Semua Lokasi</option>
                            <option value="Rak 1">Rak 1</option>
                            <option value="Rak 2">Rak 2</option>
                            <option value="Rak 3">Rak 3</option>
                            <option value="Rak 4">Rak 4</option>
                            <option value="Rak 5">Rak 5</option>
                            <option value="Rak 6">Rak 6</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mb-6 bg-white p-6 border border-gray-300 rounded-lg shadow-lg max-w-6xl mx-auto">
               <div className="py-2 px-4 bg-gray-100 rounded-lg shadow-md mb-2 max-w-6xl w-full mx-auto">
                    <p className="text-sm font-medium text-gray-600">
                    Total Buku: {totalBooks}
                    </p>
                </div>

                <div className="space-y-4">
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-md bg-gray-50">
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <span className='text-sm font-medium text-gray-600'>Judul:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.judul}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Jumlah Buku:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.jumlah_buku}</span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Bahasa:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.bahasa}</span>
                                 </div>

                                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Kategori:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.kategori}</span>
                                 </div>

                                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Lokasi Penyimpanan:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.lokasi_penyimpanan}</span>
                                 </div>

                                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Status Ketersediaan:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.status_ketersediaan}</span>
                                 </div>                   
                            </div>
                        ))
                    ) : (
                        <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md">Tidak ada buku ditemukan untuk filter tersebut.</p>
                    )}
                </div>
            </div>
            
            {showScrollToTop && (
                <button 
                    onClick={scrollToTop} 
                    className="fixed bottom-60 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-2 shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                   </svg>
                </button>
            )}
        </div>
        </div>
    ); 
}

export default FilterData;