// Code was written by Muhammad Sindida Hilmy

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const SearchData = () => {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [peminjaman, setPeminjaman] = useState([]);
    const [query, setQuery] = useState('');
    const [errorQuery, setErrorQuery] = useState('');
    const [errorName, setErrorName] = useState('');
    const [searched, setSearched] = useState(false);
    const [totalPeminjaman, setTotalPeminjaman] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [peminjamanData, setPeminjamanData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchDataBook, setSearchDataBook] = useState('');
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

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

    useEffect(() => {
      if (searchName.trim() === '') {
        setTotalPeminjaman(null);
        setNamaLengkap('');
      }
    }, [searchName]);
  
    const refreshToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/token');
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
        if (query) {
          searchData(response.data.accessToken, query);
        }
      } catch (error) {
        if (error.response) {
          navigate('/login');
        }
      }
    };
  
    // API Pertama
    const searchData = async (token, searchQuery) => {
      try {
        const response = await axios.get(`http://localhost:5000/loan/search?query=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = response.data.catatanPeminjaman || [];
        if (data.length > 0) {
          setPeminjaman(data);
          setErrorQuery(''); 
        } else {
          setPeminjaman([]);
          setErrorQuery('Tidak ada data peminjaman yang ditemukan.'); 
        }
        
        setSearched(true);
      } catch (error) {
        setErrorQuery('Terjadi kesalahan saat mendapatkan data peminjaman'); 
        console.error('Error saat mendapatkan data peminjaman:', error);
      }
    };

    // API Kedua
    const searchDataPeminjaman = async (token, searchName) => {
      try {
        const response = await axios.get(`http://localhost:5000/peminjaman/count/${searchName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jumlahPinjaman = response.data.jumlahPinjaman || 0;
        if (jumlahPinjaman > 0) {
          setTotalPeminjaman(jumlahPinjaman);
          setNamaLengkap(response.data.namaLengkap);
          setErrorName('');
          setSearched(true);
        } else {
          setTotalPeminjaman(0);
          setNamaLengkap(''); 
          setErrorName('Tidak ada data peminjaman yang ditemukan.');
        }
      } catch (error) {
        setTotalPeminjaman(null); 
        setNamaLengkap(''); 
        if (error.response && error.response.data && error.response.data.message) {
          setErrorName(error.response.data.message); 
        } else {
          setErrorName('Terjadi kesalahan saat menghitung total peminjaman');
        }
        console.error('Error saat menghitung total peminjaman:', error);
      }
    };

    // API Ketiga
    const getDataByBook = async () => {
      if (!searchDataBook || searchDataBook.trim() === '') {
        setErrorMessage('Masukkan kata kunci.'); 
        return; 
      }
      try {
        const response = await axios.get(`http://localhost:5000/peminjaman/data/${searchDataBook}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data); 
        setPeminjamanData(response.data.peminjaman); 
        setErrorMessage('');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage('Tidak ditemukan catatan peminjaman untuk judul buku yang dimaksud.');
        } else {
          setErrorMessage('Terjadi kesalahan dalam memproses permintaan.');
        }
      }
    };
    
    const handleSearch = (e) => {
      e.preventDefault();
      setErrorName(''); 
    
      setTotalPeminjaman(null);
      setNamaLengkap('');
    
      if (query) {
        searchData(token, query);
      } else {
        setErrorQuery('Masukkan kata kunci pencarian.');
      }
    };

    const handleSearchTwo = (e) => {
      e.preventDefault();
      setErrorQuery('');
      setPeminjaman([]);
    
      if (searchName.trim() === '') {
        setErrorName('Masukkan kata kunci pencarian.'); 
        setTotalPeminjaman(null);
        setNamaLengkap('');
        setSearched(false);
        return;
      }
    
      searchDataPeminjaman(token, searchName);
    };

    const handleQueryChange = (e) => {
      setQuery(e.target.value);
      if (e.target.value === '') {
        setPeminjaman([]);
        setSearched(false);
      }

      setErrorQuery('');
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
  
    return (
      <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center p-6 pt-12">
        <div className="container max-w-[25rem] sm:max-w-6xl bg-white shadow-md rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Pencarian Data Peminjaman</h1>
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm"
            >
              Back 
            </button>
          </div>

          {/* Search bar pertama */}
          <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Cari berdasarkan nama siswa atau judul buku . . ."
              className={`w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500 ${errorQuery && 'border-red-500'}`}
            />
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none w-full sm:w-full text-center"
            >
              Cari
            </button>
          </form>

          {/* Hasil search bar pertama */}
          {peminjaman.length > 0 && (
            <ul className="space-y-6 mb-4">
              {peminjaman.map((item) => (
                <li key={item.id_peminjaman} className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="md:flex justify-between items-start space-y-4 md:space-y-0">
                    <div className="md:w-1/2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Nama:</span>
                        <span className="text-sm text-gray-700 truncate">{item.user.name}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Kelas:</span>
                        <span className="text-sm text-gray-700 truncate">{item.user.kelas}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">No Telepon:</span>
                        <span className="text-sm text-gray-700 truncate">{item.user.no_telepon}</span>
                      </div>
                    </div>

                    <div className="md:w-1/2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Judul Buku:</span>
                        <span className="text-sm text-gray-700 truncate">{item.buku.judul}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Tanggal Peminjaman:</span>
                        <span className="text-sm text-gray-700 truncate">
                          {new Date(item.tanggal_peminjaman).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Tanggal Pengembalian:</span>
                        <span className="text-sm text-gray-700 truncate">
                          {new Date(item.tanggal_pengembalian).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Tanggal Perpanjangan:</span>
                        <span className="text-sm text-gray-700 truncate">
                          {item.tanggal_perpanjangan
                            ? new Date(item.tanggal_perpanjangan).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Jumlah Pinjaman:</span>
                      <span className="text-sm text-gray-700 truncate">{item.jumlah_pinjaman}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`text-sm text-gray-700 truncate ${item.status_peminjaman === 'sedang dipinjam' ? 'text-yellow-800' : 'text-green-800'}`}>
                        {item.status_peminjaman}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Catatan:</span>
                      <span className="text-sm text-gray-700 truncate">{item.catatan || 'Tidak ada catatan'}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {errorQuery && (
            <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center mb-4">{errorQuery}</p>
          )}

          {/* Search bar kedua */}
          <form onSubmit={handleSearchTwo} className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              className={`w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500 ${errorName && 'border-red-500'}`}
              value={searchName}
              placeholder="Cari berdasarkan nama lengkap . . ."
              onChange={(e) => {
                setSearchName(e.target.value);
                if (e.target.value.trim() !== '') {
                  setErrorName(''); 
                }

                if (e.target.value.trim() === '') {
                    setErrorName(''); 
                    setTotalPeminjaman(null);
                    setNamaLengkap('');
                    setSearched(false);
                    }
                }}
            />

            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none w-full sm:w-full text-center"
            >
              Cari
            </button>
          </form>

          {/* Hasil search bar kedua */}
          {searched && totalPeminjaman > 0 && (
            <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Nama:
                  <span className="ml-2 text-sm text-gray-700 truncate">{namaLengkap}</span>
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Jumlah Buku:
                  <span className="ml-2 text-sm text-gray-700 truncate">{totalPeminjaman}</span>
                </p>
              </div>
            </div>
          )}

          {errorName && ( 
            <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center mb-4">{errorName}</p>
          )}
          
          {/* search bar ketiga */}
          <div>
            <p className='text-sm font-semibold text-gray-700 text-left mb-2'>Pencarian data buku</p>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <input 
                type="text"
                value={searchDataBook}
                onChange={(e) => {
                  setSearchDataBook(e.target.value);
                  setErrorMessage('');
                  if (e.target.value === '') {
                    setPeminjamanData([]);
                  }
                }}
                placeholder="Masukkan judul buku . . ."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    getDataByBook();
                  }
                }}
                className={`w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-500 ${errorMessage && 'border-red-500'}`}
              />
            <button className='flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none w-full sm:w-auto text-center mt-4 sm:mt-0' onClick={getDataByBook}>
              Cari
            </button>
          </div>

          {/* Hasil search bar ketiga */}
          {peminjamanData.length > 0 && (
            peminjamanData.map((item, index) => (
              <div key={index} className="mb-8 mt-4 p-6 bg-white shadow-lg rounded-lg border border-gray-200 max-w-screen-lg mx-auto">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {new Date(`${item.tahunPeminjaman}-${item.bulanPeminjaman}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex flex-wrap justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Total Buku Dipinjam</span>
                      <span className="text-2xl font-bold text-blue-600">{item.totalBukuDipinjam}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Total Peminjaman</span>
                      <span className="text-2xl font-bold text-green-600">{item.totalPeminjaman}</span>
                    </div>
                  </div>
                </div>

                {/* List data peminjaman*/}
                <div className="grid grid-cols-1 gap-6">
                  {item.data.map((peminjaman, idx) => (
                    <div key={idx} className="p-5 bg-gray-50 shadow-md rounded-lg border border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">{peminjaman.name}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                          ${peminjaman.status_peminjaman === 'sedang dipinjam' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {peminjaman.status_peminjaman}
                        </span>
                      </div>

                      <div className="text-gray-700">
                        <p className="pb-2 border-b text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Kelas: </span>
                          {peminjaman.kelas ? peminjaman.kelas : '-'}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Nomor Telepon: </span>
                          {peminjaman.no_telepon ? peminjaman.no_telepon : ''}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Judul Buku: </span>
                          {peminjaman.judul ? peminjaman.judul : 'Judul tidak ditemukan'}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Tanggal Peminjaman: </span>
                          {new Date(peminjaman.tanggal_peminjaman).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Tanggal Pengembalian: </span>
                          {new Date(peminjaman.tanggal_pengembalian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Tanggal Pengembalian Aktual: </span>
                          {peminjaman.tanggal_pengembalian_aktual
                            ? new Date(peminjaman.tanggal_pengembalian_aktual).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '-'}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Tanggal Perpanjangan: </span>
                          {peminjaman.tanggal_perpanjangan ? 
                            new Date(peminjaman.tanggal_perpanjangan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                            : '-'}
                        </p>

                        <p className="mb-2 border-b pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Jumlah Pinjaman: </span>{peminjaman.jumlah_pinjaman}
                        </p>

                        <p className="pb-2 mt-2 text-sm text-gray-700 truncate">
                          <span className="text-sm font-medium text-gray-600">Catatan: </span>
                          {peminjaman.catatan ? peminjaman.catatan : '-'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {errorMessage && (
            <div className="text-center mb-4 text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

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
};
  
export default SearchData;