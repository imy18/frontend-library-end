// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function Report() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [dataLaporan, setDataLaporan] = useState([]);
    const [kategori, setKategori] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const [totalLaporan, setTotalLaporan] = useState(0);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectedIdDelete, setSelectedIdDelete] = useState(null); 

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
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
        getData(response.data.accessToken, '');
      } catch (error) {
        if (error.response) {
          navigate('/login');
        }
      }
    };
  
    const getData = async (token, kategori) => {
      try {
        const response = await axios.get(`http://localhost:5000/pelaporan/laporan?kategori=${kategori}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataLaporan(response.data.dataLaporan);
        setTotalLaporan(response.data.dataLaporan.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleDelete = async () => {
      try {
          await axios.delete(`http://localhost:5000/pelaporan/delete/${selectedIdDelete}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          toast.success('Data laporan berhasil dihapus.', {
            position: "top-center",
            autoClose: 2000,
          });
          // Memperbarui data setelah penghapusan
          await getData(token, kategori);
          setShowModalDelete(false); 
          
      } catch (error) {
          
          toast.error(error.response.data.error, {
            position: "top-center",
            autoClose: 2000,
          });
          setShowModalDelete(false); 
      }
  };

    const handleKategoriChange = (value) => {
      setKategori(value);
      getData(token, value);
    };

    const handleUpdate = (id_pelaporan) => {
      navigate(`/dashboard/loan/report/edit/${id_pelaporan}`);
    };

    const filteredLaporan = dataLaporan.filter(laporan =>
      laporan.buku.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
      setTotalLaporan(filteredLaporan.length);
    }, [filteredLaporan]);

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

    const openModalDelete = (id) => {
      setSelectedIdDelete(id); 
      setShowModalDelete(true); 
    };
  
    const closeModalDelete = () => {
      setShowModalDelete(false);
    };
  
    return (
      <div className="min-h-screen p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
        <h1 className="text-2xl font-bold mb-6 text-white text-center pt-3">Laporan Peminjaman</h1>
        <div className='flex justify-start mb-6 max-w-6xl mx-auto'>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm"
            >
              Back
          </button>
        </div>

        <div className="mb-4 max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Cari judul buku . . ."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div className="mb-6 flex justify-center items-center space-x-4 w-full sm:max-w-6xl mx-auto">
          <select
            value={kategori}
            onChange={(e) => handleKategoriChange(e.target.value)}
            className="text-center text-gray-800 block py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
           >
            <option value="">Semua Kategori</option>
            <option value="rusak">Rusak</option>
            <option value="hilang">Hilang</option>
          </select>
        </div>

        <div className="py-2 px-4 bg-white rounded-lg shadow-md max-w-6xl mx-auto"> 
          <p className='text-sm font-medium text-gray-600'>Total Jumlah Laporan: {totalLaporan}</p>
        </div> 

       <div className="mt-2">
        {filteredLaporan.length > 0 ? (
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {filteredLaporan.map((laporan) => (
                      <li
                        key={laporan.id_pelaporan}
                        className="p-6 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-shadow duration-200 shadow-sm shadow-lg bg-gray-50 w-full break-words"
                      >
                        <div className="flex flex-col space-y-4">
                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Nama: </span>
                            <span className="text-sm text-gray-500">{laporan.user.name}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Nomor Telepon: </span> 
                            <span className="text-sm text-gray-500">{laporan.user.no_telepon}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Kelas: </span> 
                            <span className="text-sm text-gray-500">{laporan.user.kelas}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Judul Buku: </span> 
                            <span className="text-sm text-gray-500">{laporan.buku.judul}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Jumlah Buku:</span> <span className="text-sm text-gray-500">{laporan.jumlah_buku}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Deskripsi: </span> 
                            <span className="text-sm text-gray-500">{laporan.deskripsi || '-'}</span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Tanggal:</span>{" "}
                            <span className="text-sm text-gray-500">
                              {new Date(laporan.tanggal).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </p>

                          <p className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                            <span className="font-semibold">Kategori:</span>{" "}
                            <span className="capitalize">
                              <span
                                className={`${
                                  laporan.kategori === "rusak"
                                    ? "text-red-500"
                                    : laporan.kategori === "hilang"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                }`}
                              >
                                {laporan.kategori}
                              </span>
                            </span>
                          </p>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                          <button
                            onClick={() => handleUpdate(laporan.id_pelaporan)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs py-2 px-3 rounded-md w-full"
                          >
                            Update
                          </button>
              
                          <button
                            onClick={() => openModalDelete(laporan.id_pelaporan)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-1 px-3 rounded-md w-full"
                            >
                            Delete
                          </button>
                          </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg font-medium mt-16">
                Tidak ada laporan.
              </p>
            )}
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
        {showModalDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded shadow-2xl max-w-xs w-full p-6">
            <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
            <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data laporan ini?</p>
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
        <ToastContainer/>
      </div>
    );
}
  
export default Report;