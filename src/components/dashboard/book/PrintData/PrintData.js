// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

function BookTable({ books }) {
  const displayValue = (value) => (value ? value : "-");

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
          <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center">No</th>
            <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center w-20">Judul</th>
            <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center">Penerbit</th>
            <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center">DCC</th>
            <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center">Kelas</th>
            <th className="px-4 py-2 text-md font-semibold text-gray-800 text-center">Kategori</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
               <td className="border px-4 py-2 text-md text-gray-500 text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-md text-gray-500">{displayValue(book.judul)}</td>
              <td className="border px-4 py-2 text-md text-gray-500">{displayValue(book.penerbit)}</td>
              <td className="border px-4 py-2 text-md text-gray-500">{displayValue(book.dcc)}</td>
              <td className="border px-4 py-2 text-md text-gray-500">{displayValue(book.kelas)}</td>
              <td className="border px-4 py-2 text-md text-gray-500">{displayValue(book.kategori)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PrintData = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [booksData, setBooksData] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    getData();
  }, [token]);

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

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/buku');
      if (Array.isArray(response.data.buku)) {
        setBooksData(response.data.buku);
      } else {
        console.error('Received data.buku is not an array:', response.data.buku);
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMonthYearChange = (e) => {
    setSelectedMonthYear(e.target.value);
  };

  const getUniqueMonthYearOptions = () => {
    const monthYearSet = new Set();
    booksData.forEach(book => {
      const date = new Date(book.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      monthYearSet.add(monthYear);
    });
    return Array.from(monthYearSet).sort((a, b) => new Date(b) - new Date(a));
  };

  const monthYearOptions = getUniqueMonthYearOptions();

  const filteredBooks = booksData.filter(book => {
    const matchesCategory = selectedCategory ? book.kategori === selectedCategory : true;
    const matchesMonthYear = selectedMonthYear
      ? new Date(book.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonthYear
      : true;

    return matchesCategory && matchesMonthYear;
  });

  return (
    <div className="p-4 mt-6">
      <div className="flex flex-col items-center justify-center mb-2 print-hidden space-y-2">
        {/* Dropdown untuk filter bulan dan tahun */}
        <select
          value={selectedMonthYear}
          onChange={handleMonthYearChange}
          className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
        >
          <option value="">Semua Bulan & Tahun</option>
          {monthYearOptions.map((monthYear, index) => (
            <option key={index} value={monthYear}>
              {monthYear}
            </option>
          ))}
        </select>

        {/* Dropdown untuk kategori */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
        >
          <option value="">Semua Kategori Buku</option>
          <option value="Kurikulum">Kurikulum</option>
          <option value="Fiksi">Fiksi</option>
          <option value="Nonfiksi">Nonfiksi</option>
        </select>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center mt-4 space-y-4 lg:space-y-0 lg:space-x-4 print-hidden mb-6">
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <BookTable books={filteredBooks} />
      <style>
        {`
          @media print {
            .print-hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PrintData;