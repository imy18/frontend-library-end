// Code was written by MuhammadSindida Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Loan = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [peminjaman, setPeminjaman] = useState([]);
  const [filteredPeminjaman, setFilteredPeminjaman] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [error, setError] = useState('');
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null); 
  const [selectedIdDelete, setSelectedIdDelete] = useState(null); 
  const [catatan, setCatatan] = useState(''); 
  const [role, setRole] = useState('');

  // Non pustakawan
  const [showModalLapor, setShowModalLapor] = useState(false);
  const [kategori, setKategori] = useState(''); 
  const [deskripsi, setDeskripsi] = useState(''); 
  const [jumlahBuku, setJumlahBuku] = useState(''); 
  const [selectedIdLapor, setSelectedIdLapor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorExtend, setErrorExtend] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdExtend, setSelectedIdExtend] = useState(null);
  const [durasi_perpanjangan, setDurasi] = useState('2'); 
  const [showModalExtend, setShowModalExtend] = useState(false);
  // End

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    window.addEventListener('scroll', handleScroll); 

    return () => {
        window.removeEventListener('scroll', handleScroll); 
    };
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, peminjaman, statusFilter]);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      getPeminjaman(response.data.accessToken);
      setRole(decoded.role); 
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const getPeminjaman = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/peminjaman/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPeminjaman(response.data);
    } catch (error) {
      setError('Terjadi kesalahan saat mendapatkan data peminjaman');
      console.error('Error saat mendapatkan data peminjaman:', error);
    }
  };

  const filterData = () => {
    const query = searchQuery.toLowerCase();
    const filtered = peminjaman.filter(item => {
      const matchesQuery = item.user.name.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'semua' || item.status_peminjaman === statusFilter;
      return matchesQuery && matchesStatus;
    });
    setFilteredPeminjaman(filtered);
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'sudah dikembalikan':
        return 'bg-green-200';
      case 'menunggu persetujuan':
        return 'bg-gray-200';
      case 'sedang dipinjam':
        return 'bg-yellow-200';
      default:
        return 'bg-gray-200';
    }
  };

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:5000/peminjaman/acc/${selectedId}`, { catatan }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Peminjaman berhasil disetujui.', {
        position: "top-center",
        autoClose: 2000,       
      });
      
      getPeminjaman(token);
      setShowModal(false); 
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Gagal menyetujui peminjaman';
  
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000,
      });
      setShowModal(false); 
      console.error('Error saat menerima peminjaman:', error.response?.data);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/peminjaman/tolak/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Peminjaman berhasil ditolak.', {
        position: "top-center",
        autoClose: 2000,       
      });
      getPeminjaman(token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error('Gagal menolak peminjaman');
      }
      console.error('Error saat menolak peminjaman:', error);
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`http://localhost:5000/peminjaman/kembali/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Peminjaman berhasil dikembalikan.', {
        position: "top-center",
        autoClose: 2000,       
      });
      getPeminjaman(token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error('Gagal mengembalikan peminjaman');
      }
      console.error('Error saat mengembalikan buku:', error);
    }
  };

  const capitalizeStatus = (status) => {
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
 const totalDataPeminjaman = filteredPeminjaman.length;

 const statusOptions = [
    { value: 'semua', label: 'Semua Status' },
    { value: 'menunggu persetujuan', label: 'Menunggu Persetujuan' },
    { value: 'sedang dipinjam', label: 'Sedang Dipinjam' },
    { value: 'sudah dikembalikan', label: 'Sudah Dikembalikan' },
  ] ;

  const handleDelete = async () => {
    try {
   
      await axios.delete(`http://localhost:5000/peminjaman/delete/${selectedIdDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Data peminjaman berhasil dihapus.', {
        position: "top-center",
        autoClose: 2000,
      });
  
      // Ambil ulang data peminjaman setelah penghapusan
      getPeminjaman(token);
      setShowModalDelete(false); 
    } catch (error) {
      // Tampilkan pesan error jika gagal menghapus
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        toast.error('Gagal menghapus peminjaman', {
          position: "top-center",
          autoClose: 2000,
        });
        setShowModalDelete(false); 
      }
      console.error('Error saat menghapus peminjaman:', error);
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

  const openModal = (id) => {
    setSelectedId(id); 
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false);
    setCatatan(''); 
  };

  const openModalDelete = (id) => {
    setSelectedIdDelete(id); 
    setShowModalDelete(true); 
  };

  const closeModalDelete = () => {
    setShowModalDelete(false);
  };

  // NON ADMIN
  useEffect(() => {
    setDurasi(2);
  }, []);

  const openModalLapor = (id) => {
    setSelectedIdLapor(id); 
    setShowModalLapor(true); 
  };

  const closeModalLapor = () => {
    setShowModalLapor(false);
    setKategori(''); 
    setDeskripsi(''); 
    setJumlahBuku(''); 
  };

  const openModalExtend = (id) => {
    setSelectedIdExtend(id); 
    setShowModalExtend(true); 
  };

  const closeModalExtend = () => {
    setShowModalExtend(false);
    setDurasi(''); 
  };

  const handleLapor = async () => {
    try {
      await axios.post(`http://localhost:5000/pelaporan/laporkan/${selectedIdLapor}`, { kategori, deskripsi, jumlahBuku }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Peminjaman berhasil dilaporkan.', {
        position: "top-center",
        autoClose: 2000,       
      });
      
      getPeminjaman(token);
      setShowModalLapor(false); 
    } catch (error) {
    console.error('Error resetting password:', error);
          if (error.response && error.response.data && error.response.data.error) {
            setErrorMessage(error.response.data.error); 
          }
        }
  };

  const handleExtend = async () => {
    try {
      await axios.post(`http://localhost:5000/perpanjangan/request/${selectedIdExtend}`, { durasi_perpanjangan }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Permintaan perpanjangan berhasil diajukan.', {
        position: "top-center",
        autoClose: 2000,       
      });
      
      getPeminjaman(token);
      setShowModalExtend(false); 
    } catch (error) {
    console.error('Error:', error);
          if (error.response && error.response.data && error.response.data.error) {
            setErrorExtend(error.response.data.error); 
          }
        }
  };

  const filteredPeminjaman2 = peminjaman.filter((item) => {
    // Filter berdasarkan judul buku dan status peminjaman
    const matchesTitle = item.buku.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || item.status_peminjaman === statusFilter;
  
    return matchesTitle && matchesStatus;
  });
  

  // Non pustakawan
  if (role !== 'pustakawan') {
    return (
      <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
        <h1 className="text-2xl font-bold mb-6 text-white text-center pt-5">Data Peminjaman</h1>
        <div className="mb-6 flex flex-col space-y-2 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="w-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 text-sm font-medium text-center w-full"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>  
          </div>
        </div>

        <div className="mb-4 max-w-6xl mx-auto">
          <input
            type="text"
            className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Cari berdasarkan judul buku . . ."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2 max-w-6xl mx-auto">
          <p className="text-sm font-medium text-gray-600">Total Jumlah Peminjaman: {totalDataPeminjaman}</p>
        </div>

        {filteredPeminjaman2.length === 0 ? (
          <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md max-w-4xl mx-auto">
          Tidak ada data peminjaman.
        </p>

        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {filteredPeminjaman2.map((item) => (
                  <div
                    key={item.id_peminjaman}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg overflow-hidden border flex flex-col justify-between"
                  >

                  <div className={`p-1 ${getStatusBackgroundColor(item.status_peminjaman)} rounded-t-lg`}>
                    <p className="text-lg font-semibold text-gray-800 text-center mb-2 pt-2">
                    {capitalizeStatus(item.status_peminjaman)}
                    </p>
                  </div>

                  <div className="p-6 pt-2 flex-grow">
                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600">
                          Nama:
                        </span> {item.user.name}</p>
                    </div>

                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Kelas:
                        </span> {item.user.kelas}</p>
                    </div>

                    <div className="py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Nomor Telepon:
                        </span> {item.user.no_telepon}</p>
                    </div>

                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Judul Buku:
                        </span> {item.buku.judul}</p>
                    </div>

                    {item.status_peminjaman === 'menunggu persetujuan' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Peminjaman:
                            </span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pinjaman:
                            </span> {item.jumlah_pinjaman}</p>
                        </div>
                      </>
                    )}

                    {item.status_peminjaman === 'sedang dipinjam' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate"><span className="text-sm font-medium text-gray-600 mb-1">Tanggal Peminjaman:</span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Perpanjangan: 
                            </span> {item.tanggal_perpanjangan ? formatDate(item.tanggal_perpanjangan) : '-'}
                          </p>
                        </div>
                            
                        <div className="py-2">
                          <p className="text-sm text-gray-700 truncate"><span className="text-sm font-medium text-gray-600 mb-1">Jumlah Pinjaman:</span> {item.jumlah_pinjaman}</p>
                        </div>
                                        
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Catatan: 
                            </span> {item.catatan ? item.catatan : '-'}
                          </p>
                        </div>
                      </>
                    )}

                    {item.status_peminjaman === 'sudah dikembalikan' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Peminjaman:
                            </span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian Aktual:
                            </span> {formatDate(item.tanggal_pengembalian_aktual)}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Perpanjangan: 
                            </span> {item.tanggal_perpanjangan ? formatDate(item.tanggal_perpanjangan) : '-'}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Denda: 
                            </span> {item.denda === 0 ? '-' : item.denda}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pinjaman:
                            </span> {item.jumlah_pinjaman}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pengembalian Terlambat: 
                            </span> {item.jumlah_pengembalian_terlambat === 0 ? '-' : item.jumlah_pengembalian_terlambat}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Catatan: 
                            </span> {item.catatan ? item.catatan : '-'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {item.status_peminjaman === 'sedang dipinjam' && (
                    <div className="p-6 pt-0">
                      <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs py-2 px-3 rounded-md w-full"
                            onClick={() => openModalExtend(item.id_peminjaman)}
                          > Ajukan perpanjangan
                        </button>

                        <button
                            onClick={() => openModalLapor(item.id_peminjaman)}// Ganti dengan id_peminjaman yang sesuai
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs py-1 px-3 rounded-md w-full"
                        >
                            Laporkan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {showModalLapor && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-2">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Laporkan Peminjaman</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
              <select
                className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
                  ${errorMessage === 'Kategori wajib dipilih.'
                  ? 'border-red-500' : ''}`}
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                >
                  <option value="" disabled>Pilih Kategori</option> 
                  <option value="hilang">Hilang</option>
                  <option value="rusak">Rusak</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
              <input 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
                ${errorMessage === 'Deskripsi wajib diisi.'
                ? 'border-red-500' : ''}`}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi" 
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah Buku</label>
              <input 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
                ${errorMessage === 'Jumlah buku wajib diisi.'
                  ? 'border-red-500' : ''}`}
                value={jumlahBuku}
                onChange={(e) => {
                // Mengambil data peminjaman yang sesuai dengan selectedIdLapor
                const selectedPeminjaman = peminjaman.find(item => item.id_peminjaman === selectedIdLapor);
                const maxBuku = selectedPeminjaman ? selectedPeminjaman.jumlah_pinjaman : 1; 
                  
                // Mengatur nilai input dengan batas minimum 1 dan maksimum sesuai data peminjaman
                const value = Math.max(1, Math.min(e.target.value, maxBuku));
                  setJumlahBuku(value);
                }}
                      
                placeholder="Jumlah Buku"
                type="number" 
                min={1} 
                max={peminjaman.find(item => item.id_peminjaman === selectedIdLapor)?.jumlah_pinjaman || 1} // Batas maksimal sesuai jumlah buku peminjaman
              />
            </div>

            {errorMessage&& (
                <p className="text-white text-sm mb-4 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">
                  {errorMessage}
                </p>
              )}
              
              <div className="mt-4 flex space-x-2">
                <button
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                  onClick={handleLapor}
                >
                  Laporkan
                </button>
                <button
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  onClick={closeModalLapor}
                >
                  Cancel
                </button>
              </div>
          </div>
        </div>
      )}

      {showModalExtend && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-2">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Pengajuan Perpanjangan Peminjaman</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Durasi
                </label>
                <input
                  className="cursor-not-allowed shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={`${durasi_perpanjangan} Hari`} 
                  readOnly 
                />
              </div>

              {errorExtend&& (
                <p className="text-white text-sm mb-4 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">
                  {errorExtend}
                </p>
              )}
        
              <div className="mt-4 flex space-x-2">
                <button
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                  onClick={handleExtend}
                >
                  Ajukan
                </button>
                <button
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  onClick={closeModalExtend}
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
  // End
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
      <h1 className="text-2xl font-bold mb-6 text-white text-center pt-5">Data Peminjaman</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Cari berdasarkan nama . . ."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
  
      <div className="mb-6 flex flex-col space-y-2 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="w-full">
            <button
              onClick={() => navigate('/dashboard/loan/loan-report')}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Laporan Peminjaman
            </button>
          </div>

          <div className="w-full">
            <button
              onClick={() => navigate('/dashboard/loan/search')}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Telusuri Data
            </button>
          </div>

          <div className="w-full">
            <button
              onClick={() => navigate('/dashboard/loan/insert-data')}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Tambah Data
            </button>
          </div>

          <div className="w-full">
            <button
              onClick={() => navigate('/dashboard/loan/extension')}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Perpanjangan Peminjaman
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="w-full">
            <button
              onClick={() => navigate('/dashboard/loan/report')}
              className="block py-2 px-4 rounded-sm cursor-pointer text-sm font-medium text-center w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Laporan
            </button>
          </div>

          <div className="w-full">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 text-sm font-medium text-center w-full"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>  
        </div>
      </div>

      <div className="py-2 px-4 bg-white rounded-lg shadow-md mb-2 max-w-6xl mx-auto">
        <p className="text-sm font-medium text-gray-600">Total Jumlah Peminjaman: {totalDataPeminjaman}</p>
      </div>

      {filteredPeminjaman.length === 0 ? (
        <p className="text-sm font-semibold text-gray-700 text-center my-4 p-4 bg-gray-200 rounded-lg shadow-md max-w-4xl mx-auto">
        Tidak ada data peminjaman.
      </p>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredPeminjaman.map((item) => (
                <div
                  key={item.id_peminjaman}
                  className="bg-gray-100 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div className={`p-1 ${getStatusBackgroundColor(item.status_peminjaman)} rounded-t-lg`}>
                    <p className="text-lg font-semibold text-gray-800 text-center mb-2 pt-2">
                    {capitalizeStatus(item.status_peminjaman)}
                    </p>
                  </div>

                  <div className="p-6 pt-2 flex-grow">
                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600">
                          Nama:
                        </span> {item.user.name}</p>
                    </div>

                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Kelas:
                        </span> {item.user.kelas}</p>
                    </div>

                    <div className="py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Nomor Telepon:
                        </span> {item.user.no_telepon}</p>
                    </div>

                    <div className="py-2 border-b">
                      <p className="text-sm text-gray-700 truncate">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                          Judul Buku:
                        </span> {item.buku.judul}</p>
                    </div>

                    {item.status_peminjaman === 'menunggu persetujuan' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Peminjaman:
                            </span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pinjaman:
                            </span> {item.jumlah_pinjaman}</p>
                        </div>
                      </>
                    )}

                    {item.status_peminjaman === 'sedang dipinjam' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate"><span className="text-sm font-medium text-gray-600 mb-1">Tanggal Peminjaman:</span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Perpanjangan: 
                            </span> {item.tanggal_perpanjangan ? formatDate(item.tanggal_perpanjangan) : '-'}
                          </p>
                        </div>
                            
                        <div className="py-2">
                          <p className="text-sm text-gray-700 truncate"><span className="text-sm font-medium text-gray-600 mb-1">Jumlah Pinjaman:</span> {item.jumlah_pinjaman}</p>
                        </div>
                                        
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Catatan: 
                            </span> {item.catatan ? item.catatan : '-'}
                          </p>
                        </div>
                      </>
                    )}

                    {item.status_peminjaman === 'sudah dikembalikan' && (
                      <>
                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Peminjaman:
                            </span> {formatDate(item.tanggal_peminjaman)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian:
                            </span> {formatDate(item.tanggal_pengembalian)}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Pengembalian Aktual:
                            </span> {formatDate(item.tanggal_pengembalian_aktual)}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Tanggal Perpanjangan: 
                            </span> {item.tanggal_perpanjangan ? formatDate(item.tanggal_perpanjangan) : '-'}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Denda: 
                            </span> {item.denda === 0 ? '-' : item.denda}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pinjaman:
                            </span> {item.jumlah_pinjaman}</p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Jumlah Pengembalian Terlambat: 
                            </span> {item.jumlah_pengembalian_terlambat === 0 ? '-' : item.jumlah_pengembalian_terlambat}
                          </p>
                        </div>

                        <div className="py-2 border-b">
                          <p className="text-sm text-gray-700 truncate">
                            <span className="text-sm font-medium text-gray-600 mb-1">
                              Catatan: 
                            </span> {item.catatan ? item.catatan : '-'}
                          </p>
                        </div>

                        <div className="py-2 pt-4 flex justify-start">
                          <button
                          onClick={() => openModalDelete(item.id_peminjaman)}
                           className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-2 px-4 rounded-md sm:w-fit"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {item.status_peminjaman === 'menunggu persetujuan' && (
                    <div className="p-6 pt-0">
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-2 px-3 rounded-md w-full"
                            onClick={() => openModal(item.id_peminjaman)}
                          > Accept
                        </button>

                        <button
                            onClick={() => handleReject(item.id_peminjaman)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-1 px-3 rounded-md w-full"
                          >
                            Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {item.status_peminjaman === 'sedang dipinjam' && (
                    <div className="p-6 pt-0 flex justify-start">
                      <button
                        onClick={() => handleReturn(item.id_peminjaman)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-2 px-4 rounded-md sm:w-fit"
                      >
                        Return
                      </button>
                      </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

            {showModal && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                <p className="text-gray-500 text-xs mb-1">Opsional</p>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tambahkan catatan . . ."
                  ></textarea>
                  
                  <div className="mt-4 flex space-x-2">
                  
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                      onClick={handleAccept}
                    >
                      Accept
                    </button>
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModalDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded shadow-2xl max-w-xs w-full p-6">
                <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
                <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data peminjaman ini?</p>
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
      };

    export default Loan;