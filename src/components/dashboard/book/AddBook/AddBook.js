// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBook = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    judul: '',
    penulis: '',
    penerbit: '',
    tahun_terbit: '',
    dcc: '',
    kategori: '',
    jumlah_buku: '',
    bahasa: '',
    lokasi_penyimpanan: '',
    status_ketersediaan: 'Tersedia',
    foto: null,
    kondisi: 'Baik',
    keterangan: '',
    kelas: ''
  });
  
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
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const tambahBuku = async () => {
    try {
      // Validasi form sebelum melakukan upload
      const errorMessage = validateForm();
      if (errorMessage) {
        setMessage(errorMessage);
        setMessageType('error');
        return;
      }
  
      const isTitleExists = await checkBookTitleExists(formData.judul);
      if (isTitleExists) {
        setMessage('Judul buku sudah ada.');
        setMessageType('error');
        return;
      }

      const isDccExists = await checkBookDccExists(formData.dcc);
      if (isDccExists) {
        setMessage('DCC sudah terdaftar.');
        setMessageType('error');
        return;
      }
  
      // Semua validasi berhasil, lanjut ke + upload foto
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
  
      const response = await axios.post('http://localhost:5000/buku/create', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setMessage(response.data.message);
      setMessageType('success');
      toast.success('Data buku berhasil ditambahkan.', {
        position: "top-center",
        autoClose: 2000,
      });
  
      // Reset form setelah sukses
      setFormData({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: '',
        dcc: '',
        kategori: '',
        jumlah_buku: '',
        bahasa: '',
        lokasi_penyimpanan: '',
        status_ketersediaan: 'Tersedia',
        foto: null,
        kondisi: 'Baik',
        keterangan: '',
        kelas: ''
      });
  
      document.getElementById('foto').value = '';
    } catch (error) {
      console.error('Error creating book:', error);
      setMessage(error.response.data.error || 'Terjadi kesalahan saat menambahkan buku.');
      setMessageType('error');
    }
  };
  
  const validateForm = () => {
    if (!formData.judul) return 'Judul wajib diisi.';
    if (!formData.dcc) return 'DCC wajib diisi.';
    if (!formData.penulis) return 'Penulis wajib diisi.';
    if (!formData.kategori) return 'Kategori wajib dipilih.';
    if (!formData.jumlah_buku) return 'Jumlah buku wajib diisi.';
    if (!formData.bahasa) return 'Bahasa wajib dipilih.';
    if (!formData.kondisi) return 'Kondisi wajib dipilih.';
    if (!formData.status_ketersediaan) return 'Status ketersediaan wajib dipilih.';
    return null; 
  };
  
  const checkBookTitleExists = async (judul) => {
    try {
      const response = await axios.post('http://localhost:5000/buku/check-judul', { judul }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data.exists; 
    } catch (error) {
      console.error('Error checking book title:', error);
      return false; 
    }
  };

  const checkBookDccExists = async (dcc) => {
    try {
      const response = await axios.post('http://localhost:5000/buku/check-dcc', { dcc }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data.exists; 
    } catch (error) {
      console.error('Error checking dcc:', error);
      return false; 
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value,
    });
};

const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData({
        ...formData,
        [name]: files[0],
    });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    tambahBuku();
  };

  return (
    <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center px-6 sm:px-6 lg:px-6 pt-12 sm:pt-6 pb-6 sm:pb-6">
      <div className="max-w-6xl w-full mx-auto mb-2">
        <div className="bg-white border rounded-md shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Tambah Data Buku</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="judul" className="block text-gray-700 text-sm font-bold mb-2">Judul</label>
                <input
                    type="text"
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'Judul wajib diisi.'
                    || message === 'Judul buku sudah ada.' ? 'border-red-500' : ''}`}
                    placeholder="Judul"
                />
              </div>

              <div>
                <label htmlFor="penulis" className="block text-gray-700 text-sm font-bold mb-2">Penulis</label>
                <input
                    type="text"
                    id="penulis"
                    name="penulis"
                    value={formData.penulis}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'Penulis wajib diisi.' ? 'border-red-500' : ''}`}
                    placeholder="Penulis"
                />
              </div>

              <div>
                  <label htmlFor="penerbit" className="block text-gray-700 text-sm font-bold mb-2">Penerbit</label>
                  <input
                    type="text"
                    id="penerbit"
                    name="penerbit"
                    value={formData.penerbit}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Penerbit"
                  />
              </div>

              <div>
                  <label htmlFor="tahun_terbit" className="block text-gray-700 text-sm font-bold mb-2">Tahun Terbit</label>
                  <input
                    type="text"
                    id="tahun_terbit"
                    name="tahun_terbit"
                    value={formData.tahun_terbit}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d*$/.test(input)) {
                        handleChange(e);
                      }
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Tahun Terbit"
                  />
              </div>

              <div>
                  <label htmlFor="dcc" className="block text-gray-700 text-sm font-bold mb-2">DCC</label>
                  <input
                    type="text"
                    id="dcc"
                    name="dcc"
                    value={formData.dcc}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d*$/.test(input)) {
                        handleChange(e);
                      }
                    }}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'DCC sudah terdaftar.'
                      || message === 'DCC wajib diisi.'  ? 'border-red-500' : ''}`}
                    placeholder="DCC"
                  />
              </div>

              <div>
                  <label htmlFor="kelas" className="block text-gray-700 text-sm font-bold mb-2">Kelas</label>
                  <input
                    type="text"
                    id="kelas"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Kelas"
                  />
              </div>

              <div>
                  <label htmlFor="bahasa" className="block text-gray-700 text-sm font-bold mb-2">Bahasa</label>
                  <select
                    id="bahasa"
                    name="bahasa"
                    value={formData.bahasa}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'Bahasa wajib dipilih.' ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Bahasa</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Inggris">Inggris</option>
                  </select>
              </div>


              <div>
                  <label htmlFor="kategori" className="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'Kategori wajib dipilih.' ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Kurikulum">Kurikulum</option>
                    <option value="Fiksi">Fiksi</option>
                    <option value="Nonfiksi">Nonfiksi</option>
                  </select>
              </div>
              
              <div>
                  <label htmlFor="jumlah_buku" className="block text-gray-700 text-sm font-bold mb-2">Jumlah Buku</label>
                  <input
                    type="text"
                    id="jumlah_buku"
                    name="jumlah_buku"
                    value={formData.jumlah_buku}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d*$/.test(input)) {
                        handleChange(e);
                      }
                    }}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${message === 'Jumlah buku wajib diisi.' ? 'border-red-500' : ''}`}
                    placeholder="Jumlah Buku"
                  />
              </div>

              <div>
                <label htmlFor="kondisi" className="block text-gray-700 text-sm font-bold mb-2">Kondisi</label>
                <input
                  type="text"
                  id="kondisi"
                  name="kondisi"
                  value={formData.kondisi}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Kondisi"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="status_ketersediaan" className="block text-gray-700 text-sm font-bold mb-2">Status Ketersediaan</label>
                <input
                  type="text"
                  id="status_ketersediaan"
                  name="status_ketersediaan"
                  value={formData.status_ketersediaan}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Status Ketersediaan"
                  readOnly
                />
              </div>

              <div>
                  <label htmlFor="lokasi_penyimpanan" className="block text-gray-700 text-sm font-bold mb-2">Lokasi Penyimpanan</label>
                  <select
                    id="lokasi_penyimpanan"
                    name="lokasi_penyimpanan"
                    value={formData.lokasi_penyimpanan}
                    onChange={handleChange}
                    className="cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Pilih Lokasi Penyimpanan</option>
                    <option value="Rak 1">Rak 1</option>
                    <option value="Rak 2">Rak 2</option>
                    <option value="Rak 3">Rak 3</option>
                    <option value="Rak 4">Rak 4</option>
                    <option value="Rak 5">Rak 5</option>
                    <option value="Rak 6">Rak 6</option>
                  </select>
              </div>

              <div>
                  <label htmlFor="keterangan" className="block text-gray-700 text-sm font-bold mb-2">Keterangan</label>
                  <input
                    type="text"
                    id="keterangan"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Keterangan"
                  />
              </div>

              <div>
                <label htmlFor="foto" className="block text-gray-700 text-sm font-bold mb-2">Foto</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
              </div>
            </div>
            
            {messageType === 'error' && (
              <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">
                {message}
              </p>
            )}

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
};

export default AddBook;