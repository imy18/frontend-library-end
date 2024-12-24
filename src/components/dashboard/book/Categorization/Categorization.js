// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Categorization() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [kondisi, setKondisi] = useState('baik'); 
    const [books, setBooks] = useState([]); // Data buku
    const [totalBooks, setTotalBooks] = useState(0);
    const [isSearched, setIsSearched] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);
    
    useEffect(() => {
        if (token) { 
            filterBooksByCondition(); 
        }
    }, [token, kondisi]); // Menjalankan ulang ketika token dan kondisi berubah

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

    const filterBooksByCondition = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/buku/kondisi/${kondisi}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(response.data.books); 
            setTotalBooks(response.data.totalBooks); 
            setIsSearched(true); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setBooks([]); 
            setTotalBooks(0); 
            setIsSearched(false);
        }
    };

    const handleKondisiChange = (e) => {
        setKondisi(e.target.value); // Mengubah kondisi saat dropdown berubah
    };

    return (
        <div className="container mx-auto min-h-screen p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
            <h1 className="text-2xl font-bold mb-5 text-gray-200 text-center">Filter Buku Berdasarkan Kondisi</h1>
            <div className="sticky top-0 z-10 bg-white p-4 border border-gray-300 rounded-lg shadow-lg mt-6 max-w-6xl mx-auto"> 
                <div className="flex justify-start mb-4">
                    <button type="button" onClick={() => navigate(-1)} className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm">
                        Back
                    </button>
                </div>
                <div className="mb-6 flex justify-center items-center space-x-4 w-full">
                    <select
                        value={kondisi}
                        onChange={handleKondisiChange}
                        className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                        >
                        <option value="baik">Baik</option>
                        <option value="rusak">Rusak</option>
                        <option value="hilang">Hilang</option>
                    </select>
                </div>
            </div>

            {isSearched && (
                <>
                    <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2 mt-6 max-w-6xl mx-auto">
                        <p className="text-sm font-medium text-gray-600">
                            Total Buku: {totalBooks}
                        </p>
                    </div>
                    
                    <div className="max-h-[500px] overflow-y-auto space-y-4 mb-2 p-6 bg-gray-50 rounded-lg shadow-md max-w-6xl mx-auto">
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <span className='text-sm font-medium text-gray-600'>Judul:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.judul}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Penulis:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.penulis}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mt-2">
                                    <span className='text-sm font-medium text-gray-600'>Kondisi:</span>
                                    <span className='text-sm text-gray-700 truncate'>{book.kondisi}</span>
                                </div>
               
                            </div>
                        ))
                    ) : (
                        <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md">Tidak ada buku ditemukan untuk kondisi tersebut.</p>
                    )}
                </div>
                </>
            )}
        </div>
    );
}

export default Categorization;