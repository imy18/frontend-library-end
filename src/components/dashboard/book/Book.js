// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Book = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(4);
  const [showNextPage, setShowNextPage] = useState(false);
  const [showPrevPage, setShowPrevPage] = useState(false);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalBuku, setTotalBuku] = useState(0);
  const [dataBuku, setDataBuku] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [role, setRole] = useState('');

  // Non pustakawan
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredBuku, setFilteredBuku] = useState([]); 
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  // End

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getData();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp)
      setRole(decoded.role); 
    } catch (error) {
      if (error.response){
        navigate('/login');
      }
    }
  }
  
  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/buku');
      if (Array.isArray(response.data.buku)) {
        setDataBuku(response.data.buku);
      } else {
        console.error('Received data.buku is not an array:', response.data.buku);
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  }

  const deleteData = async (id_buku) => {
    try {
      await axios.delete(`http://localhost:5000/buku/delete/${id_buku}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Buku dengan ID ${id_buku} berhasil dihapus.`);
      setDeleteModalIsOpen(false);
      setDeleteId(null); 
      toast.success('Data buku berhasil dihapus.', {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        setSuccessMessage('');
        getData(); 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error
        ? error.response.data.error
        : `Gagal menghapus buku dengan ID ${id_buku}: ${error.message}`;
  
      setDeleteModalIsOpen(false); 
      setDeleteId(null);
  
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = Array.isArray(dataBuku) ? dataBuku.slice(indexOfFirstData, indexOfLastData) : [];
    setPaginatedData(currentData);
  
    setShowNextPage(Array.isArray(dataBuku) && dataBuku.length > indexOfLastData);
    setShowPrevPage(currentPage > 1);
  
    setTotalBuku(Array.isArray(dataBuku) ? dataBuku.length : 0);
  }, [currentPage, dataBuku, dataPerPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredData = dataBuku.filter((buku) => buku.judul.toLowerCase().includes(term));
    setCurrentPage(1);
    setPaginatedData(filteredData.slice(0, dataPerPage));
    setTotalBuku(filteredData.length);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteData(deleteId);
    }
  };

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    content: {
      width: '300px', 
      height: '180px', 
      margin: 'auto', 
      borderRadius: '5px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
      backgroundColor: 'white',
      color: '#333',
      textAlign: 'center'
    },
  };

  // Non pustakawan
  useEffect(() => {
    window.addEventListener('scroll', handleScroll); 

    return () => {
        window.removeEventListener('scroll', handleScroll); 
    };
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/buku/filter', {
          params: {
            bahasa: selectedLanguage,
            kategori: selectedCategory,
            status_ketersediaan: selectedAvailability,
            lokasi_penyimpanan: selectedLocation,
          },
        });
        setFilteredBuku(response.data.filter); // Menyimpan buku yang difilter ke state
      } catch (error) {
        console.error('Error filtering book data:', error);
      }
    };
    fetchFilteredData();
  }, [selectedCategory, selectedLanguage, selectedAvailability, selectedLocation]);

  useEffect(() => {
    // Memfilter data buku berdasarkan kata kunci pencarian dan kategori yang dipilih
    const filtered = dataBuku.filter(buku => {
      const matchesSearch = buku.judul.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    setFilteredBuku(filtered);
  }, [searchTerm, dataBuku]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedLanguage('');
    setSelectedAvailability('');
    setSelectedLocation('');
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setSelectedCategory('');
    setSelectedAvailability('');
    setSelectedLocation('');
  };

  const handleAvailabilityChange = (e) => {
    setSelectedAvailability(e.target.value);
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedLocation('');
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedAvailability('');
  };

  const totalFilteredBuku = filteredBuku.length;

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
  
    if (role !== 'pustakawan') {
      return (
        <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Daftar Buku</h1>
          <div className="flex flex-col sm:flex-row mb-4">
            <div className="w-full sm:w-1/4 p-2">
              <label className="block text-gray-200 text-sm font-semibold mb-2">Kategori:</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-white text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                            >
                <option value="">Semua Kategori</option>
                <option value="Kurikulum">Kurikulum</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Nonfiksi">Nonfiksi</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4 p-2">
              <label className="block text-gray-200 text-sm font-semibold mb-2">Bahasa:</label>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="bg-white text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                            >
                <option value="">Semua Bahasa</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Inggris">Inggris</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4 p-2">
              <label className="block text-gray-200 text-sm font-semibold mb-2">Status Ketersediaan:</label>
              <select
                value={selectedAvailability}
                onChange={handleAvailabilityChange}
                className="bg-white text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
                            >
                <option value="">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4 p-2">
              <label className="block text-gray-100 text-sm font-semibold mb-2">Lokasi Penyimpanan:</label>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                className="bg-white text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
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

          <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Cari judul buku . . ."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2">
            <p className="text-sm font-medium text-gray-600">Total Jumlah Judul Buku: {totalFilteredBuku}</p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredBuku.length > 0 && ( 
                filteredBuku.map((buku) => (
                  <div 
                    key={buku.id_buku} 
                    className="bg-gray-50 border rounded-lg overflow-hidden hover:bg-gray-100  transition-none" // Card buku dengan efek hover
                    >
                      {!buku.foto || buku.foto === '-' ? (
                        <div
                        className="w-40 h-60 object-cover mx-auto mt-4" 
                          style={{ aspectRatio: '2 / 3' }} 
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-40 h-60  text-gray-400"
                          >
                            <path d="M21 4H7a2 2 0 00-2 2v12a2 2 0 002 2h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 13H7V6h13v11zM5 18H4V6H3v13a1 1 0 001 1h13v-1H5z" />
                          </svg>
                        </div>
                      ) : (
                      <img 
                        src={`http://localhost:5000/uploadBook/${buku.foto}`} 
                        alt={buku.judul} 
                        className="w-40 h-60 object-cover mx-auto mt-4" 
                      />
                      )}
                      <div className="p-4">
                        <h2 className="text-lg font-semibold">{buku.judul}</h2>
                        <p className="text-gray-600">{buku.penulis}</p>
                        <p className="text-xs text-gray-600">{buku.status_ketersediaan}</p>
                        <div className="flex justify-end mt-4 space-x-2">
                          <Link
                            to={`/dashboard/book/detail/${buku.id_buku}`}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs py-2 px-3 rounded-md w-full text-center"
                            >
                              Detail
                          </Link> 

                          <Link
                            to={`/dashboard/book/loan/${buku.id_buku}`}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs py-2 px-3 rounded-md w-full text-center"
                            >
                              Pinjam
                          </Link> 
                        </div>
                      </div>
                  </div>
                ))
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
    }
  // End
  
  return (
    <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Daftar Buku</h1>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari judul buku . . ."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto mb-2">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Judul</th>
              <th className="py-3 px-6 text-center">Kategori</th>
              <th className="py-3 px-6 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {paginatedData.map((buku) => (
              <tr key={buku.id_buku} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-200">{buku.judul}</td>
                <td className="py-3 px-6 text-left border-r border-gray-200">{buku.kategori}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex flex-col md:flex-row justify-center items-center space-y-1 md:space-y-0 md:space-x-2">
                 
                    <Link
                      to={`/dashboard/book/detail/${buku.id_buku}`}
                      className="flex-1 py-1 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none w-full text-center"
                    >
                      Detail
                    </Link> 

                    <button
                      onClick={() => {
                        setDeleteId(buku.id_buku);
                        setDeleteModalIsOpen(true);
                      }}
                      className="flex-1 py-1 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none w-full text-center"
                      >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2">
        <p className="text-sm font-medium text-gray-600">Total Jumlah Judul Buku: {totalBuku}</p>
      </div>

      <div className="flex justify-center mb-6">
          <button
            onClick={handlePrevPage}
            disabled={!showPrevPage}
            className={`${
              !showPrevPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-small px-1 py-1 rounded-sm mr-2`}
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNextPage}
            disabled={!showNextPage}
            className={`${
              !showNextPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-small px-1 py-1 rounded-sm`}
          >
            <FaArrowRight />
          </button>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <Link
          to="/dashboard/book/add"
          className="block bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Tambah Data
        </Link>

        <Link
          to="/dashboard/book/print"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Cetak Data
        </Link>

        <Link
          to="/dashboard/book/recapitulation"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Rekapitulasi
        </Link>

        <Link
          to="/dashboard/book/label"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Label Buku
        </Link>

        <Link
          to="/dashboard/book/categorization"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Kategorisasi
        </Link>

        <Link
          to="/dashboard/book/filter"
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Filter Buku
        </Link>
      </div>

      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        contentLabel="Delete Confirmation"
        style={modalStyles}
      >
        <>
          <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
          <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data buku ini?</p>
          <div className="flex justify-center space-x-3">
            <button 
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
              onClick={() => handleDelete()}
            >
              Delete
            </button>
            <button 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              onClick={() => setDeleteModalIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      </Modal>  
    <ToastContainer />
  </div>
  );
};

export default Book;