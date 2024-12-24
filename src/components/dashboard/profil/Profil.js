// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useUser } from '../../../context/UserContext'; 
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, setUser } = useUser();
  const [expire, setExpire] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [token, setToken] = useState(''); 

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const newToken = response.data.accessToken;
      const decoded = jwtDecode(newToken);
      setExpire(decoded.exp);
      setToken(newToken); // Simpan token di state
      getData(newToken);
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
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfileImageClick = () => {
    if (user.foto) { 
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDeletePhoto = async () => {
    try {
        await refreshToken(); 
        if (!token) {
            throw new Error('User is not authenticated');
        }

        console.log('Token:', token);

        await axios.delete('http://localhost:5000/users/delete-photo', {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });

        setUser({ ...user, foto: '' }); 
        closePopup();

        toast.success('Foto berhasil dihapus.', {
          position: "top-center",
          autoClose: 2000, 
      });
      } catch (error) {
          console.error('Error deleting photo:', error);

          toast.error('Gagal menghapus foto', {
            position: "top-center",
            autoClose: 2000, 
        });
      }
  };  

  if (!user) {
    return <div>Loading...</div>;
  }

  const getInitials = (name) => {
    if (!name) return 'NN';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center py-12 px-7 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-8 border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          {user.foto ? (
            <img
              src={`http://localhost:5000/uploads/${user.foto}`}
              alt={user.name || 'Profile'}
              className="mx-auto rounded-full h-24 w-24 border-4 cursor-pointer"
              onClick={handleProfileImageClick}
            />
          ) : (

          <div
            className="mx-auto rounded-full h-24 w-24 border-4 flex items-center justify-center bg-gray-300"
          >
            <span className="text-white text-lg font-semibold">
              {getInitials(user.name)}
            </span>
          </div>

          )}
    
          <h3 className="text-lg font-semibold text-gray-800 text-center mt-2">{user.name || '-'}</h3>
          <p className="text-gray-600 text-center">
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '-'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-gray-800">
          <div className="flex justify-between border-b border-gray-300 py-2">
            <span className="font-bold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 py-2">
            <span className="font-bold">Kelas:</span>
            <span>{user.kelas}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 py-2">
            <span className="font-bold">Nomor Telepon:</span>
            <span>{user.no_telepon}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 py-2">
            <span className="font-bold">Jenis Kelamin:</span>
            <span>{user.jenis_kelamin}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 py-2">
            <span className="font-bold">Angkatan:</span>
            <span>{user.angkatan}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard/profil/edit"
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none w-full sm:w-full"
          >
            Edit Profile
          </Link>
          <Link
            to="/dashboard/profil/reset-password"
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none w-full sm:w-full"
          >
            Reset Password
          </Link>
        </div>
      </div>

      {isPopupOpen && user.foto && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-2 rounded-lg shadow-lg w-10/12 sm:w-3/4 md:w-1/3 lg:w-1/3 lg:max-w-lg mx-auto">
            <button
              className="absolute top-0 right-0 m-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded-full p-1 bg-white shadow-lg"
              onClick={closePopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={`http://localhost:5000/uploads/${user.foto}`} 
              alt="Profile"
              className="max-w-full h-auto rounded-lg"
            />
             <div className="flex justify-end mt-2 mr-2"> 
        <button
          onClick={handleDeletePhoto}
          className="py-2 px-4 bg-red-500 hover:bg-red-600 text-sm font-medium rounded-md text-white hover:bg-red-600 focus:outline-none flex items-center justify-center"
        >
          <FaTrash/> 
        </button>
      </div>
          </div>
        </div>
      )}

      <ToastContainer/>
    </div>
  );
};

export default Profile;