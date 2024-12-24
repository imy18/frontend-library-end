// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Visit = () => {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [error, setError] = useState('');
    const [dataKunjungan, setDataKunjungan] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(4);
    const [showNextPage, setShowNextPage] = useState(false);
    const [showPrevPage, setShowPrevPage] = useState(false);
    const [paginatedData, setPaginatedData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteMonth, setDeleteMonth] = useState('');
    const [deleteYear, setDeleteYear] = useState('');
    const [showKonfirmModal, setShowKonfirmModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
            getData(response.data.accessToken);
        } catch (error) {
            if (error.response) {
                navigate('/login');
            }
        }
    };

    const getData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/kunjungan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataKunjungan(response.data.data); // Akses 'data' di dalam respons
        } catch (error) {
            setError('Terjadi kesalahan saat mendapatkan data kunjungan');
            console.error('Error saat mendapatkan data kunjungan:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/kunjungan/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    month: deleteMonth,
                    year: deleteYear
                }
            });
            setShowKonfirmModal(false);
            setShowDeleteModal(false);
            setDeleteMonth('')
            setDeleteYear('')
            getData(token);
            toast.success('Data kunjungan berhasil dihapus.', {
              position: "top-center",
              autoClose: 2000,
            });
        } catch (error) {
            console.error("Error saat menghapus data:", error);
            setError("Tidak ada data kunjungan pada periode tersebut.");
            setShowKonfirmModal(false);
        }
    };
    
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleKonfirmClick = () => {
        setShowKonfirmModal(true);
    };

    const closeModalDelete = () => {
        setShowKonfirmModal(false);
        
      };

      const closeModal = () => {
        setShowDeleteModal(false);
        setDeleteMonth(''); 
        setDeleteYear(''); 
        setError('')
      };

    const filteredData = useMemo(() => {
      return dataKunjungan
          .filter((kunjungan) => {
              const visitDate = new Date(kunjungan.tanggal_kunjungan);
              const visitMonth = visitDate.getMonth() + 1;
              const visitYear = visitDate.getFullYear();
  
              const matchesMonth = selectedMonth ? visitMonth === parseInt(selectedMonth) : true;
              const matchesYear = selectedYear ? visitYear === parseInt(selectedYear) : true;
  
              return matchesMonth && matchesYear;
          })
          .filter((kunjungan) => {
              return (
                  kunjungan.nama_pengunjung.toLowerCase().includes(searchQuery.toLowerCase()) // Add this filter
              );
          });
    }, [dataKunjungan, selectedMonth, selectedYear, searchQuery]); // Add searchQuery to the dependency array
  

    useEffect(() => {
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
        setPaginatedData(currentData);

        setShowNextPage(filteredData.length > indexOfLastData);
        setShowPrevPage(currentPage > 1);

        setTotalData(filteredData.length);
    }, [currentPage, filteredData, dataPerPage]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const availableMonths = [
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

    const availableYears = Array.from(new Set(dataKunjungan.map(item => new Date(item.tanggal_kunjungan).getFullYear())));

    return (
        <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Data Kunjungan</h1>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="w-full">
              <button
                onClick={() => navigate('/dashboard/visit/barcode')}
                className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Barcode
              </button>
            </div>
            <div className="w-full">
              <button
                onClick={() => navigate('/dashboard/visit/grafik')}
                className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Grafik
              </button>
            </div>

            <div className="w-full">
            <button
              onClick={handleDeleteClick}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full p-6 mx-12 sm:mx-6">
            <p className="text-gray-500 mb-4 text-center font-bold">Pilih periode yang ingin dihapus</p>

            {/* Bulan Selection */}
            <div className="mb-4">
                <label className="text-sm text-gray-600">Pilih Bulan</label>
                <select
                    value={deleteMonth}
                    onChange={(e) => setDeleteMonth(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 text-sm text-gray-600"
                >
                    <option value="">Pilih Bulan</option>
                    {availableMonths.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tahun Selection */}
            <div className="mb-4">
               <label className="text-sm text-gray-600">Pilih Tahun</label>
                <select
                    value={deleteYear}
                    onChange={(e) => setDeleteYear(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 text-sm text-gray-600"
                >
                    <option value="">Pilih Tahun</option>
                    {availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {error && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center mb-2">{error}</p>}

            {(deleteMonth === "" || deleteYear === "") && (
                <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center mb-2">Bulan dan tahun wajib dipilih.</p>
              )}

                    <div className="flex justify-center space-x-3">
                    <button
                            onClick={handleKonfirmClick}
                          className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                            disabled={!deleteMonth || !deleteYear}
                        >
                            Delete
                        </button>
                        <button
                          onClick={closeModal}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        >
                            Cancel
                        </button>
                      
                    </div>
                </div>
            </div>
        )}

        {showKonfirmModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded shadow-2xl max-w-xs w-full p-6">
                <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
                <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data kunjungan ini?</p>
                <div className="flex justify-center space-x-3">
                  
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                      onClick={closeModalDelete}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

        {/* Dropdown bulan dan tahun */}
        <div className="flex sm:flex-row flex-col mb-4">
          <div className="sm:mr-4 sm:mb-0 mb-4 w-full sm:w-auto">
            <label className="block text-gray-100 text-sm font-semibold mb-2" htmlFor="month">
              Pilih Bulan:
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 text-sm font-medium text-center w-full"
            >
              <option value="">Semua Bulan</option>
              {availableMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-gray-100 text-sm font-semibold mb-2" htmlFor="year">
              Pilih Tahun:
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 text-sm font-medium text-center w-full"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Cari berdasarkan nama . . ."
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
         </div>

        <div className="overflow-x-auto mb-2">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Nama Pengunjung</th>
                <th className="py-3 px-6 text-center">Tanggal</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
  
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedData.map((kunjungan) => (
                  <tr key={`${kunjungan.id_buku}_${kunjungan.tanggal_kunjungan}`} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-200 capitalize">
                          {kunjungan.nama_pengunjung}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200">
                          {new Date(kunjungan.tanggal_kunjungan).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                          })}
                      </td>
                      <td className="py-3 px-6 text-left border-r border-gray-200">
                          {kunjungan.status_kunjungan
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                      </td>
                  </tr>
              ))}
          </tbody>
          </table>
      </div>

      <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2">
        <p className="text-sm font-medium text-gray-600">Total Jumlah Kunjungan: {totalData}</p>
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
        <ToastContainer/>
      </div>
    );
  
};

export default Visit;