// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function CreatedAt() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [userData, setUserData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersPerMonth, setTotalUsersPerMonth] = useState({});
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  const navigate = useNavigate();
  
  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); 
  
      return () => {
          window.removeEventListener('scroll', handleScroll); 
      };
  }, []);
  
    const refreshToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/token');
        const token = response.data.accessToken;
        const decoded = jwtDecode(token);
        setToken(token);
        setExpire(decoded.exp);
        getData(token);
      } catch (error) {
        if (error.response) {
          navigate('/login');
        }
      }
    };
  
    const getData = async (token) => {
      try {
        const response = await axios.get('http://localhost:5000/users/created', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data.userData);
        setTotalUsers(response.data.totalUsers);
        setTotalUsersPerMonth(response.data.totalUsersPerMonth);
      } catch (error) {
        console.error(error);
      }
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      
    // Fungsi untuk mengekstrak angka bulan dari key
    const extractMonthFromKey = (key) => {
      const match = key.match(/Bulan\s*:\s*(\d+)/); // Mencari pola "Bulan : {angka}"
      return match ? parseInt(match[1]) : null;
    };

    const formatMonthYear = (key) => {
      const monthNumber = extractMonthFromKey(key);
      const year = extractYearFromKey(key);
      const monthName = monthNumber ? monthNames[monthNumber - 1] : null;
      return monthName && year ? `${monthName} ${year}` : 'Bulan tidak valid';
    };

    const extractYearFromKey = (key) => {
      const match = key.match(/Tahun\s*:\s*(\d+)/);
      return match ? match[1] : '';
    };

    const getInitials = (name) => {
      if (!name) return 'NN';
      const names = name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase();
    };

    const handleScroll = () => {
      if (window.scrollY > 300) { 
          setShowScrollTopButton(true);
      } else {
          setShowScrollTopButton(false);
      }
    };
  
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    };

    const filterDataByYear = (data, year) => {
      if (!year) return data;
      return data.filter((group) => {
        const groupYear = extractYearFromKey(group.dataUser);
        return groupYear === year;
      });
    };

    const handleYearChange = (event) => {
      setSelectedYear(event.target.value);
    };

    // Ambil tahun unik dari totalUsersPerMonth
    const uniqueYears = Array.from(new Set(Object.keys(totalUsersPerMonth).map(extractYearFromKey)));

    const filteredUserData = filterDataByYear(userData, selectedYear);

    const totalUsersPerYear = {};
    Object.entries(totalUsersPerMonth).forEach(([key, value]) => {
      const year = extractYearFromKey(key);
      if (year) {
        if (!totalUsersPerYear[year]) {
          totalUsersPerYear[year] = 0;
        }
        totalUsersPerYear[year] += value;
      }
    });

    return (
      <div className="container mx-auto p-5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen pt-10 ">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Data Anggota</h1>
        <div className="flex justify-start mb-2  max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm">
            Back
          </button>
        </div>

        <div className="mb-2 flex justify-center items-center space-x-4 w-full sm:max-w-6xl mx-auto">
          <select 
            id="yearFilter"
            value={selectedYear}
            onChange={handleYearChange}
            className="text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                  >
            <option value="" disabled hidden>Semua Tahun</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="mb-5 bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
          <h2 className="py-3 text-sm font-medium text-gray-600 text-left">Total Pengguna: {totalUsers}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="py-3 text-sm font-medium text-gray-600 text-left">Total Pengguna per Bulan:</h3>
              <div className="space-y-2">
                {Object.entries(totalUsersPerMonth).map(([key, value]) => {
                  const monthNumber = extractMonthFromKey(key);
                  const monthName = monthNumber ? monthNames[monthNumber - 1] : null;
                  const year = key.match(/Tahun\s*:\s*(\d+)/) ? key.match(/Tahun\s*:\s*(\d+)/)[1] : '';

                  return (
                    <div key={key} className="border px-6 py-3 text-sm font-medium text-gray-600 text-center">
                      {monthName && year ? `${monthName} ${year}: ${value} Pengguna` : `Bulan tidak valid: ${key}`}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="py-3 text-sm font-medium text-gray-600 text-left">Total Pengguna per Tahun:</h3>
              <div className="space-y-2">
                {Object.entries(totalUsersPerYear).map(([year, value]) => (
                  <div key={year} className="border px-6 py-3 text-sm font-medium text-gray-600 text-center">
                    {year ? `${year}: ${value} Pengguna` : `Tahun tidak valid: ${year}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredUserData.length > 0 ? (
          filteredUserData.map((group, index) => (
            <div key={index} className="mb-2 bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <div className="px-6 py-3 text-sm font-medium text-gray-600 text-center">
                {formatMonthYear(group.dataUser)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.userData.length > 0 ? (
                  group.userData.map((user) => (
                    <div 
                      key={user.id_user} 
                      className="border p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-shadow duration-200"
                    >
                    <div className="mb-4 flex justify-center items-center">  
                      {user.foto ? (
                      <img 
                        src={`http://localhost:5000/uploads/${user.foto}`} 
                        alt={user.nama} 
                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-300 shadow-md" 
                      />
                      ) : (
                      <div className="relative w-20 h-20 flex items-center justify-center bg-gray-200 border-2 border-gray-300 rounded-full shadow-md text-gray-500 text-xl font-bold">
                        <div className="text-center">
                        {getInitials(user.nama)}
                      </div>
                    </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">{user.nama || '-'}</p>
                    <p className="text-sm text-gray-500 font-semibold mb-3">
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '-'}
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Email: <span className="text-sm text-gray-500">{user.email || '-'}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No Telepon: <span className="text-sm text-gray-500">{user.no_telepon || '-'}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Kelas: <span className="text-sm text-gray-500">{user.kelas || '-'}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Jenis Kelamin: <span className="text-sm text-gray-500">{user.jenis_kelamin || '-'}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Angkatan: <span className="text-sm text-gray-500">{user.angkatan || '-'}</span>
                    </p>
                    <p className="border-2 border-blue-500 text-sm font-medium text-gray-600">
                      Dibuat: <span className="text-sm text-gray-500">
                        {user.dibuat ? new Date(user.dibuat).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        }) : '-'}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md">Tidak ada data pengguna untuk ditampilkan</p>
            )}
          </div>
        </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Tidak ada data pengguna untuk ditampilkan</p>
      )}

      {showScrollTopButton && (
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
  );
}
  
export default CreatedAt;