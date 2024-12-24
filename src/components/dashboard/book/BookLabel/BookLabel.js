// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const BookLabel = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [dataLabel, setDataLabel] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState(''); 
  const [monthYearOptions, setMonthYearOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    if (token) {
      getLabel();
    }
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

  const getLabel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/buku/label', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data)) {
        setDataLabel(response.data);
        setFilteredData(response.data); // Set filtered data awalnya dengan dataLabel penuh
        extractMonthYearOptions(response.data);
      } else {
        console.error('Received data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching label data:', error);
    }
  }

  //  Mengekstrak daftar bulan dan tahun dari dataLabel
  const extractMonthYearOptions = (data) => {
    const uniqueMonthYearSet = new Set();
    
    data.forEach(label => {
      const monthYear = moment(label.createdAt).format('MMMM YYYY'); 
      uniqueMonthYearSet.add(monthYear);
    });

    setMonthYearOptions([...uniqueMonthYearSet]); // Set unique options ke state
  };

  // Filtering berdasarkan bulan dan tahun setiap kali selectedMonthYear berubah
  useEffect(() => {
    let filtered = dataLabel;

    if (selectedMonthYear) {
      filtered = filtered.filter(label =>
        moment(label.createdAt).format('MMMM YYYY') === selectedMonthYear
      );
    }

    setFilteredData(filtered);
  }, [selectedMonthYear, dataLabel]);

  const handleMonthYearChange = (event) => {
    setSelectedMonthYear(event.target.value);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center pt-6 print:hidden">Label Buku</h1>
      <div className="flex justify-center mb-2 w-full print:hidden">
        <select
          id="bulan-tahun"
        className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-full lg:max-w-sm"
          value={selectedMonthYear}
          onChange={handleMonthYearChange}
        >
          <option value="">Semua Bulan & Tahun</option>
          {monthYearOptions.map((monthYear, index) => (
            <option key={index} value={monthYear}>
              {monthYear}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center mt-2 mb-6 space-y-4 lg:space-y-0 lg:space-x-4 w-full max-w-6xl">
        <button
          className="w-full lg:w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none print:hidden"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          className="w-full lg:w-1/2 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none print:hidden"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredData.map((label, index) => (
          <div
            key={label.id}
            className={`bg-white p-4 rounded-lg border-2 border-gray-300 ${
              (index + 1) % 6 === 0 ? 'page-break' : ''
            }`}
          >
            <div className="flex justify-between border-b pb-2 mb-2">
              <span className="text-gray-600 font-bold">DCC:</span>
              <span className="text-gray-700">{label.dcc || '-'}</span>
            </div>
            <div className="flex justify-between border-b pb-2 mb-2">
              <span className="text-gray-600 font-bold">Penulis:</span>
              <span className="text-gray-700">{label.penulis || '-'}</span>
            </div>
            <div className="flex justify-between border-b pb-2 mb-2">
              <span className="text-gray-600 font-bold">Judul:</span>
              <span className="text-gray-700">{label.judul || '-'}</span>
            </div>
            <div className="flex justify-between border-b pb-2 mb-2">
              <span className="text-gray-600 font-bold">Jumlah Buku:</span>
              <span className="text-gray-700">{label.jumlah_buku || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Kelas:</span>
              <span className="text-gray-700">{label.kelas || '-'}</span>
            </div>
          </div>
        ))}
      </div>
  
      <style jsx>{`
        @media print {
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
  
};

export default BookLabel;