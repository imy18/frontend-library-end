// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBook = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { id_buku } = useParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    judul: '',
    penulis: '',
    tahun_terbit: '',
    penerbit: '',
    dcc: '',
    kategori: '',
    jumlah_buku: '',
    bahasa: '',
    lokasi_penyimpanan: '',
    status_ketersediaan: '',
    foto: '',
    kondisi: '',
    keterangan: '',
    kelas: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    fetchData();
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

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buku/detail/${id_buku}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const updateBuku = async () => {
    try {
        // Pertama lakukan validasi tanpa mengirim file
        const response = await axios.put(`http://localhost:5000/buku/update/${id_buku}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Jika validasi BE berhasil dan tidak ada error, lanjutkan pengiriman file jika ada
        const updatedFormData = new FormData();
        for (const key in formData) {
            updatedFormData.append(key, formData[key]);
        }

        if (selectedFile) {
            updatedFormData.append('foto', selectedFile);
        }

        // Kirim request ke server dengan file jika semua validasi sukses
        const uploadResponse = await axios.put(`http://localhost:5000/buku/update/${id_buku}`, updatedFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        // Menangani suksesnya pembaruan data
        setSuccessMessage('Data buku berhasil diperbarui.');
        setErrorMessage(''); 
        toast.success('Data buku berhasil diperbarui', {
            position: "top-center",
            autoClose: 2000,
        });
        setTimeout(() => {
            setSuccessMessage('');
            navigate(-1);
        }, 2000);

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            setErrorMessage(error.response.data.error);
        } else {
            setErrorMessage('Terjadi kesalahan saat memperbarui data buku');
        }

        console.error('Error updating book:', error.response ? error.response.data : error.message);
    }
};

const handleChangeFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
};

const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
};

const handleSubmit = (e) => {
    e.preventDefault();
    updateBuku();
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-6 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-6xl mt-5 mb-5">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Perbarui Data Buku</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="judul" className="block text-gray-700 text-sm font-bold mb-2">Judul</label>
                  <input
                    type="text"
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorMessage === 'Judul wajib diisi.'
                    || errorMessage === 'Judul buku sudah ada.' ? 'border-red-500' : ''}`}
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
                    ${errorMessage === 'Penulis wajib diisi.' ? 'border-red-500' : ''}`}
                    placeholder="Penulis"
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
              </div>
            </div>

            <div>
              <div className="space-y-6">
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
                      ${errorMessage === 'DCC wajib diisi.' 
                        || errorMessage === 'DCC sudah terdaftar.' ? 'border-red-500' : ''}`}
                    placeholder="DCC"
                  />
                </div>

                <div>
                  <label htmlFor="kategori" className="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorMessage === 'Kategori wajib dipilih.' ? 'border-red-500' : ''}`}
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
                    ${errorMessage === 'Jumlah buku wajib diisi.'   
                    || errorMessage === 'Jumlah buku tidak boleh bernilai 0.'? 'border-red-500' : ''}`}
                    placeholder="Jumlah Buku"
                  />
                </div>

                <div>
                  <label htmlFor="foto" className="block text-gray-700 text-sm font-bold mb-2">Foto</label>
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    onChange={handleChangeFile}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="bahasa" className="block text-gray-700 text-sm font-bold mb-2">Bahasa</label>
                  <select
                    id="bahasa"
                    name="bahasa"
                    value={formData.bahasa}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorMessage === 'Bahasa wajib dipilih.' ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Bahasa</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Inggris">Inggris</option>
                  </select>
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
                  <label htmlFor="status_ketersediaan" className="block text-gray-700 text-sm font-bold mb-2">Status Ketersediaan</label>
                  <select
                    id="status_ketersediaan"
                    name="status_ketersediaan"
                    value={formData.status_ketersediaan}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorMessage === 'Status ketersediaan wajib dipilih.' ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Status</option>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Tidak Tersedia">Tidak Tersedia</option>
                  </select>
                </div> 
              </div>
            </div>
            
            <div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="kondisi" className="block text-gray-700 text-sm font-bold mb-2">Kondisi</label>
                  <select
                    id="kondisi"
                    name="kondisi"
                    value={formData.kondisi}
                    onChange={handleChange}
                    className={`cursor-pointer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                    ${errorMessage === 'Kondisi wajib dipilih.' ? 'border-red-500' : ''}`}
                  >
                    <option value="">Pilih Kondisi</option>
                    <option value="Baik">Baik</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Hilang">Hilang</option>
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
              </div>
            </div>
          </div>

          {errorMessage && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{errorMessage}</p>}

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditBook;