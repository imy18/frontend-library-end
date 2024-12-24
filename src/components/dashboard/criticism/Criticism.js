// Code was written by Muhammad Sinddia Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

function Criticism() {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [dataKritikSaran, setDataKritikSaran] = useState({});
    const [totalKeseluruhan, setTotalKeseluruhan] = useState(0);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();
  
    useEffect(() => {
        refreshToken();
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
            getData(response.data.accessToken);
        } catch (error) {
            if (error.response) {
                navigate('/login');
            }
        }
    };
  
    const getData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/kritiksaran/data', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataKritikSaran(response.data.groupedData);
            setTotalKeseluruhan(response.data.totalKeseluruhan);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async () => {
      try {
          await axios.delete('http://localhost:5000/kritiksaran/delete', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          // Memperbarui data setelah penghapusan
          getData(token);
          setIsModalOpen(false);
          toast.success('Semua data kritik dan saran berhasil dihapus.', {
            position: "top-center",
            autoClose: 2000, 
            });
        } catch (error) {
            console.error('Error deleting all data:', error);
        }
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

    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

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
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-start  bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-6 pt-10">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Kritik dan Saran</h1>
        <div className='py-2 px-4 bg-white rounded-lg shadow-md max-w-6xl w-full mx-auto'>
          <p className="text-sm font-medium text-gray-600">Total Jumlah Kritik dan Saran: {totalKeseluruhan}</p>
        </div>
        <div className="w-full max-w-6xl mt-2 space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <div className="w-full max-w-4xl mb-2">
                    {totalKeseluruhan > 0 && (
                        <div className="flex justify-start mb-2">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-red-500 text-white py-2 sm:py-1 px-2 sm:px-4 rounded-md shadow hover:bg-red-600 transition duration-300 font-medium text-xs sm:text-sm cursor-pointer"
                                
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {Object.keys(dataKritikSaran).length > 0 ? (
                    Object.keys(dataKritikSaran).map((key) => {
                        const [month, year] = key.split(', '); 
                        const monthName = bulan[parseInt(month) - 1];
                        return (
                            <div 
                                key={key} 
                                className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md"
                            >
                                <h2 className="font-medium text-gray-500 mb-2">
                                    {monthName} {year}, Total: {dataKritikSaran[key].total}
                                </h2>
                                
                                <ul className="list-none pl-0 space-y-3">
                                    {dataKritikSaran[key].data.map((item) => (
                                        <li key={item.id_kritikSaran} className="text-black">
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                                        <span className='text-sm font-medium text-gray-600'>Subjek:</span>
                                                        <span className='text-sm text-gray-700 truncate'>{item.subjek}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 border-b border-gray-200 mt-2 mb-2 pb-2">
                                                        <span className='text-sm font-medium text-gray-600'>Isi:</span>
                                                        <span className='text-sm text-gray-700 truncate'>{item.isi}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 pb-2">
                                                        <span className='text-sm font-medium text-gray-600'>Tanggal:</span>
                                                        <span className='text-sm text-gray-700 truncate'>
                                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md">
                        Tidak ada data kritik dan saran.
                    </p>
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

        <Modal
            isOpen={isModalOpen} 
            onRequestClose={() => setIsModalOpen(false)} 
            contentLabel="Delete Confirmation"
            style={modalStyles}>
              <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
              <p className='text-sm text-gray-600 text-center mb-5'>Apakah Anda yakin ingin menghapus semua data kritik dan saran?</p>
              <div className="flex justify-center space-x-3">
                  <button onClick={handleDelete} className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none">Delete</button>
                  <button onClick={() => setIsModalOpen(false)} className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">Cancel</button>
              </div>
        </Modal>
        <ToastContainer />
    </div>
  );
}

export default Criticism;