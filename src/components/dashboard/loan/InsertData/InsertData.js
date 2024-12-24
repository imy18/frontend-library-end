// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InsertData() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [judulBuku, setJudulBuku] = useState('');
  const [tanggalPengembalian, setTanggalPengembalian] = useState('');
  const [jumlahPinjaman, setJumlahPinjaman] = useState(1);
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [nameUserTwo, setNameUserTwo] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [role, setRole] = useState('');

  // Non pustakawan
  const [durasi, setDurasi] = useState('1 hari');
  const [selectedBukuId, setSelectedBukuId] = useState(null);
  const [isKurikulum, setIsKurikulum] = useState(false); 
  const [jumlahBukuTersedia, setJumlahBukuTersedia] = useState(0);
  const [durasiOptions, setDurasiOptions] = useState(['1 hari']);
  const [gambarBuku, setGambarBuku] = useState(''); 
  // End
  
  const { id_buku } = useParams(); 

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
      setRole(decoded.role); 
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const handleUserSearch = async (e) => {
    const value = e.target.value;
    setNameUserTwo(value);
        if (value.length > 2) {
            try {
                const response = await axios.get(`http://localhost:5000/peminjaman/users?query=${value}`);
                setUserSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching user suggestions:', error);
            }
        } else {
            setUserSuggestions([]);
        }
    };

    const handleUserRecommendationClick = (name) => {
        setNameUserTwo(name);
        setUserSuggestions([]);
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setJudulBuku(query);
    
        if (query.length > 2) {
        try {
            const response = await axios.get(`http://localhost:5000/peminjaman/search?query=${query}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]); // Kosongkan hasil pencarian jika ada kesalahan
        }
        } else {
        setSearchResults([]); // Kosongkan hasil pencarian jika input kosong
        }
    };
  
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const insertDataManual = async (e) => {
        e.preventDefault();

        try {
            setError(null); // Menghapus pesan error jika ada
        const response = await axios.post(
            'http://localhost:5000/peminjaman/add/manual',
            {
            judul: judulBuku,
            name_user: nameUserTwo,
            tanggal_pengembalian: tanggalPengembalian,
            jumlah_pinjaman: jumlahPinjaman,
            catatan: catatan,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        toast.success('Data peminjaman berhasil ditambahkan.', {
            position: "top-center",
            autoClose: 2000,       
          });
          // Mengosongkan form setelah berhasil menambahkan data
            setJudulBuku('');
            setNameUserTwo('');
            setTanggalPengembalian('');
            setJumlahPinjaman('');
            setCatatan('');

        } catch (error) {
        if (error.response) {
            setError(error.response.data.error);
        } else {
            setError('Terjadi kesalahan, coba lagi.');
        }
        
        }
    };

    // Non pustakawan
    useEffect(() => {
        refreshToken();
        if (id_buku) {
          fetchBookDetails(id_buku); 
          setSelectedBukuId(id_buku); 
        }
    }, [id_buku]);
      
    const fetchBookDetails = async (id_buku) => {
        try {
            const response = await axios.get(`http://localhost:5000/buku/detail/${id_buku}`, {
                headers: {
                Authorization: `Bearer ${token}`, 
                },
            });

            setJudulBuku(response.data.judul); // Set judul buku berdasarkan data dari backend
            setJumlahBukuTersedia(response.data.jumlah_buku);
            setGambarBuku(response.data.foto);
            const isKurikulumBook = response.data.kategori === 'Kurikulum';
            setIsKurikulum(isKurikulumBook);

            // Atur opsi durasi berdasarkan kategori buku
            if (isKurikulumBook) {
                setDurasiOptions(['1 Hari', '1 Bulan']); 
            } else {
                setDurasiOptions(['1 Hari']); 
                setDurasi('1 Hari'); 
            }
        } catch (error) {
          console.error('Error fetching book details:', error);
          setError('Gagal mengambil detail buku.'); 
        }
    };
    
    const requestPeminjaman = async (e) => {
        e.preventDefault();  
        try {
            const response = await axios.post(`http://localhost:5000/peminjaman/request/${selectedBukuId}`, {
                durasi: durasi,
                jumlahBuku: jumlahPinjaman 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            toast.success('Peminjaman berhasil diajukan.', {
                position: "top-center",
                autoClose: 2000,       
            });

            setTimeout(() => {
                navigate('/dashboard/book');
            }, 2000);
        
            } catch (error) {
                console.error('Error saat mengajukan peminjaman:', error);
                const errorMessage = error.response && error.response.data.error
                    ? error.response.data.error
                    : 'Terjadi kesalahan saat mengajukan peminjaman.';
                    toast.error(errorMessage, {
                        position: "top-center",
                        autoClose: 5000,       
                    });
            }
    };
            
    const handleBukuSelect = (buku) => {
        setJudulBuku(buku.judul);
        setSelectedBukuId(buku.id);
    };
    
      if (role !== 'pustakawan') {
        return (
            <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center p-6">
                <div className="max-w-6xl w-full">
                    <div className="p-6 bg-white shadow-md rounded-lg mt-6 mb-3">
                        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">{judulBuku}</h1>
                        {gambarBuku && ( 
                        <div className="flex justify-center mb-4">
                            <img src={`http://localhost:5000/uploadBook/${gambarBuku}`}alt={judulBuku}  className="w-24 h-auto rounded-lg shadow-md" />
                        </div>
                        )}

                        <form onSubmit={requestPeminjaman}>
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah Buku</label>
                                    <input
                                        type="number"
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                        `}
                                        placeholder="Jumlah Buku"
                                        value={jumlahPinjaman} 
                                        onChange={(e) => {
                                            const value = Math.max(1, Math.min(e.target.value, isKurikulum ? jumlahBukuTersedia : 1)); // Batasi input
                                            setJumlahPinjaman(value); 
                                        }} 
                                        min={1} 
                                        max={isKurikulum ? jumlahBukuTersedia : 1}
                                        readOnly={!isKurikulum} 
                                    />
                            </div>
    
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Durasi Peminjaman
                                </label>
                                <select
                                    value={durasi} 
                                    onChange={(e) => setDurasi(e.target.value)}
                                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                    `}
                                >
                                    {durasiOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                            </div>
    
                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                                >
                                    Pinjam
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
    // End
  
  return (
    <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
            <div className="p-6 bg-white shadow-md rounded-lg mt-6 mb-3">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Tambah Data Peminjaman</h1>
                <form onSubmit={insertDataManual}>
                    <div className="mb-4 flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                            <input
                                type="text"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Nama wajib diisi.'
                                || error === 'Pengguna tidak ditemukan.' 
                                || error === 'Pengguna dengan nama tersebut masih memiliki transaksi peminjaman yang sedang berlangsung.'? 'border-red-500' : ''}`}
                                value={nameUserTwo}
                                onChange={handleUserSearch}
                                placeholder="Nama"
                            />
                            
                            {userSuggestions.length > 0 && (
                                <ul className="border border-gray-300 rounded mt-1 bg-white shadow-lg">
                                    {userSuggestions.map((user) => (
                                        <li
                                            key={user.id}
                                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => handleUserRecommendationClick(user.name)}
                                        >
                                            {user.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Judul Buku</label>
                            <input
                                type="text"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Judul buku wajib diisi.' 
                                || error === 'Buku dengan judul yang dimaksud tidak dapat ditemukan.' ? 'border-red-500' : ''}`}
                                value={judulBuku}
                                onChange={handleSearch}
                                placeholder="Judul Buku"
                            
                            />
                        
                            {searchQuery && searchResults.length > 0 && (
                                <ul className="border border-gray-300 rounded mt-1 bg-white shadow-lg">
                                    {searchResults.map((buku) => (
                                        <li key={buku.id} className="px-2 py-1 hover:bg-gray-200 cursor-pointer" onClick={() => {
                                            setJudulBuku(buku.judul);
                                            setSearchResults([]);
                                        }}>
                                            {buku.judul}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                    <div className="w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah Buku</label>
                            <input
                                type="number"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                                ${error === 'Jumlah buku wajib diisi.' 
                                || error === 'Hanya diperbolehkan meminjam 1 buku untuk kategori ini.'
                                || error === 'Jumlah buku yang diminta melebihi stok yang tersedia.' ? 'border-red-500' : ''}`}
                                value={jumlahPinjaman}
                                onChange={(e) => setJumlahPinjaman(e.target.value)}
                                min="1"
                                placeholder="Jumlah Buku"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Pengembalian</label>
                            <input
                                type="date"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer
                                ${error === 'Tanggal pengembalian wajib dipilih.' ? 'border-red-500' : ''}`}
                                value={tanggalPengembalian}
                                onChange={(e) => handleInputChange(e, setTanggalPengembalian, 'tanggalPengembalian')}
                                min={new Date().toISOString().split("T")[0]}
                                onClick={(e) => e.currentTarget.showPicker()}
                            />  
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Catatan</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            rows="2"
                            placeholder="Catatan"
                        />
                        <p className="text-xs text-gray-500 ml-1">* Opsional</p>
                    </div>

                    {error && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center mb-4">{error}</p>}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <ToastContainer />
    </div>
  );
}

export default InsertData;