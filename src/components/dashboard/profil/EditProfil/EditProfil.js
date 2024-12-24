// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper from 'react-easy-crop';
import { getCroppedImage } from './cropImage';

const EditProfil = () => {
  const [user, setUser] = useState({
    no_telepon: '',
    foto: null
  });
  
  const [preview, setPreview] = useState(null);
  const [originalNoTelepon, setOriginalNoTelepon] = useState('');
  const [token, setToken] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errorNoTelepon, setErrorNoTelepon] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const token = response.data.accessToken;
      const decoded = jwtDecode(token);
      setToken(token);
      getData(token);
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const getData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/user/profil', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser({
        ...user,
        no_telepon: response.data.no_telepon
      });
      setOriginalNoTelepon(response.data.no_telepon);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({
      ...user,
      foto: file
    });
    setPreview(URL.createObjectURL(file));
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNoTelepon(''); // Reset error sebelum submit
    let croppedImage = null;
  
    // Cek nomor telepon terlebih dahulu
    try {
      const response = await axios.put('http://localhost:5000/users/edit', {
        no_telepon: user.no_telepon
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.error) {
        setErrorNoTelepon(response.data.error);
        return;
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      if (error.response && error.response.data) {
        setErrorNoTelepon(error.response.data.error || 'Terjadi kesalahan dalam pengecekan nomor telepon.');
    }
      return; 
    }
  
    // Jika tidak ada error pada nomor telepon, lanjutkan dengan pengolahan foto
    if (preview && croppedAreaPixels) {
      croppedImage = await getCroppedImage(preview, croppedAreaPixels, user.foto.type);
    }
  
    const formData = new FormData();
    formData.append('no_telepon', user.no_telepon);
    if (croppedImage) {
      formData.append('foto', croppedImage);
    }
  
    try {
      const response = await axios.put('http://localhost:5000/users/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2000, 
    });
  
      setTimeout(() => navigate(-1), 2000);
  
    } catch (error) {
      console.error('Error updating user data:', error);
  
      if (error.response && error.response.data) {
        setErrorNoTelepon(error.response.data.error || 'Terjadi kesalahan saat memperbarui data.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 py-12 px-7 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-lg p-8 pt-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Perbarui Data Profil</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="no_telepon" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
              <input
                id="no_telepon"
                name="no_telepon"
                type="text"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errorNoTelepon && 'border-red-500'}`}
                placeholder="Nomor Telepon"
                value={user.no_telepon}
                onChange={(e) => {
                  // Hanya simpan angka ke state
                  const value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                  handleChange({ target: { name: 'no_telepon', value } }); 
                }}

                onKeyDown={(e) => {
                  // Mencegah auto submit saat menekan Enter
                  if (e.key === 'Enter') {
                    e.preventDefault(); 
                  }
                }}
              />
              
            </div>
            <div>
              <label htmlFor="foto" className="block text-gray-700 text-sm font-bold mb-2">Foto Profil</label>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/*" 
                className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all duration-300 ease-in-out"
                onChange={handleFileChange}
              />
            </div>
            {preview && (
              <div className="mt-4 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden border-4 border-gray-300 shadow-lg">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="round" 
                    showGrid={false} 
                  />
                </div>
              </div>
            )}
          </div>
          {errorNoTelepon && <p className="text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">{errorNoTelepon}</p>} 
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
        <ToastContainer/>
      </div>
    </div>
  );
};

export default EditProfil;