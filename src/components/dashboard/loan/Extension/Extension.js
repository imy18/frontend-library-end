// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';

function Extension() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectedIdDelete, setSelectedIdDelete] = useState(null); 

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
            const response = await axios.get('http://localhost:5000/perpanjangan/data', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            console.log('Data perpanjangan:', response.data);
        } catch (error) {
            console.error("Error fetching extension data:", error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = data.filter((item) =>
        item.user && item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      );

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAcc = async (id) => {
        try {
          await axios.put(`http://localhost:5000/perpanjangan/acc/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            getData(token);
            toast.success('Permintaan perpanjangan berhasil disetujui.', {
              position: "top-center",
              autoClose: 2000, 
          });
          } catch (error) {
            console.error('Error accepting extension:', error);
        
            if (error.response && error.response.data && error.response.data.error) {
              toast.error(`Gagal: ${error.response.data.error}`, {
                position: "top-center",
                autoClose: 2000, 
            });
            } else {
              toast.error('Gagal Acc! Terjadi kesalahan pada server.');
            }
          }
    };
      
    const handleReject = async (id) => {
        try {
          await axios.put(`http://localhost:5000/perpanjangan/tolak/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        getData(token);
        toast.success('Permintaan perpanjangan berhasil ditolak.',{
          position: "top-center",
          autoClose: 5000, 
      });
        } catch (error) {
          console.error('Error rejecting extension:', error);
          toast.error('Gagal Reject!');
        }
    };

    const handleDelete = async () => {
      try {
          await axios.delete(`http://localhost:5000/perpanjangan/delete/${selectedIdDelete}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          getData(token); // Memperbarui data setelah penghapusan
          toast.success('Data berhasil dihapus.', {
              position: "top-center",
              autoClose: 2000,
          });
          setShowModalDelete(false); 
      } catch (error) {
          console.error('Error deleting extension:', error);
          toast.error('Gagal menghapus! Terjadi kesalahan pada server.',{
            position: "top-center",
            autoClose: 5000, 
        });
        setShowModalDelete(false); 
      }
  };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', options); // id-ID untuk format dalam bahasa Indonesia
        return formattedDate;
    };

    const capitalizeWords = (text) => {
        if (!text) return '-';
        return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
      };

      const openModalDelete = (id) => {
        setSelectedIdDelete(id); 
        setShowModalDelete(true); 
      };
    
      const closeModalDelete = () => {
        setShowModalDelete(false);
      };

    return (
        <div className="pt-10 min-h-screen px-6 sm:px-4 md:px-10 lg:px-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 ">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Perpanjangan Peminjaman</h1>
          <div className="flex justify-start mb-6">
            <button
             onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 sm:py-1 px-2 sm:px-3 rounded-sm shadow hover:bg-blue-600 transition duration-300 font-medium text-xs sm:text-sm"
            >
              Back
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nama . . ."
              value={searchTerm} 
              onChange={handleSearch}
              className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {data.length === 0 ? (
            <p className='text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md'>Tidak ada permintaan perpanjangan.</p>
          ) : (
          <>

            <div className='overflow-x-auto mb-2'>
              <table className="min-w-full bg-white shadow-md rounded-lg text-xs">
                <thead>
                  <tr className='bg-gray-200 text-gray-600 uppercase text-xs leading-normal'>
                    <th className="py-2 px-4">Nama</th>
                    <th className="py-2 px-4">Judul</th>
                    <th className="py-2 px-4">Durasi</th>
                    <th className="py-2 px-4">Tanggal</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Aksi</th>
                  </tr>
                </thead>

                <tbody className='text-gray-600 text-xs font-light'>
                  {currentData.map((item) => ( 
                    <tr key={item.id_perpanjangan} className='border-b border-gray-200 hover:bg-gray-100'>
                      <td className="py-2 px-4 text-left whitespace-nowrap">
                        {item.user ? item.user.name : '-'}
                      </td>
                    
                      <td className="py-2 px-4 text-left">
                        {item.buku ? item.buku.judul : '-'}
                      </td>
                      
                      <td className="py-2 px-4 text-left">
                        {capitalizeWords(item.durasi_perpanjangan) ? `${capitalizeWords(item.durasi_perpanjangan)} Hari` : '-'}
                      </td>

                      <td className="py-2 px-4 text-left">
                        {formatDate(item.tanggal_perpanjangan)}
                      </td>

                      <td className="py-2 px-4 text-left" style={{ textTransform: 'capitalize' }}>
                        {item.status || '-'}
                      </td>

                      <td className="py-2 px-4 text-left">
                        <div className='flex flex-col space-y-1'>
                        {item.status === 'disetujui' ? (
                          <button
                            className={`flex-1 py-1 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none w-full text-center`}
                            onClick={() => openModalDelete(item.id_perpanjangan)}
                          >
                            Delete
                          </button>
                        ) : (
                          <>
                          <button
                            className={`flex-1 py-1 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none w-full text-center`}
                            onClick={() => item.status !== 'disetujui' && handleAcc(item.id_perpanjangan)}
                            
                            >
                              Accept
                          </button>

                          <button
                            className={`flex-1 py-1 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none w-full text-center`}
                            onClick={() => item.status !== 'disetujui' && handleReject(item.id_perpanjangan)}
        
                            >
                              Reject
                          </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2">
              <p className="text-sm font-medium text-gray-600">Total Jumlah Perpanjangan Peminjaman: {currentData.length}</p>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={() => paginate('prev')}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-small px-1 py-1 rounded-sm mr-2`}
              >
                <FaArrowLeft />
              </button>

              <button
                onClick={() => paginate('next')}
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                className={`${
                  currentPage === Math.ceil(filteredData.length / itemsPerPage)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-small px-1 py-1 rounded-sm`}
              >
                <FaArrowRight />
              </button>
            </div>
          </>
          )}
          <ToastContainer/>
          {showModalDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded shadow-2xl max-w-xs w-full p-6">
              <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
              <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data ini?</p>
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
        </div>
      );
    }

  export default Extension;