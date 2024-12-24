// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Member = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [expire, setExpire] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [token, setToken] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

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
      const token = response.data.accessToken;
      const decoded = jwtDecode(token);
      setToken(token);
      setExpire(decoded.exp);
      setCurrentUserRole(decoded.role);
      console.log('Current User Role:', decoded.role); 
      getData(token);
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const getData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = response.data;
      if (Array.isArray(responseData.users)) {
        setUsers(responseData.users);
      } else {
        console.error('Invalid response data format:', responseData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const deleteUser = async () => {
    try {
      if (!token || !userToDelete) return;
      await axios.delete(`http://localhost:5000/users/delete/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter((user) => user.id_user !== userToDelete));
      setShowConfirmModal(false); 
      toast.success('Data anggota berhasil dihapus.', {
        position: "top-center",
        autoClose: 2000, 
    });

    } catch (error) {
      console.error('Error deleting user:', error);
      setShowConfirmModal(false); 
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 5000, 
    });
      } else {
        toast.error('Gagal menghapus data. Coba lagi.', {
          position: "top-center",
          autoClose: 5000, 
      });
      }
    }
  };  

  const handleDeleteClick = (id_user) => {
    setUserToDelete(id_user);
    setShowConfirmModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'NN';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const UserCard = ({ user }) => (
    <div className="bg-gray-50 border rounded-md overflow-hidden flex flex-col md:flex-row hover:bg-gray-100 transition-shadow duration-200">
      <div className="md:w-1/3 p-2 flex flex-col items-center">
          {user.foto ? (
            <img
              src={`http://localhost:5000/uploads/${user.foto}`}
              alt={user.name || '-'}
              className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-md mb-4 cursor-pointer"
              onClick={() => setSelectedPhoto(`http://localhost:5000/uploads/${user.foto}`)}
            />
          ) : (
          <div
            className="w-24 h-24 relative flex items-center justify-center bg-gray-200 border-2 border-gray-300 rounded-full shadow-md text-gray-500 text-xl font-bold mb-5 mt-2"
          >
            <span className="text-center">
              {getInitials(user.name)}
            </span>
          </div>
        )}

      <h2 className="text-md font-semibold text-gray-800 text-center">{user.name || '-'}</h2>
      <p className="text-sm text-gray-500 font-semibold text-center">
        {user.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : '-'}
      </p>
     </div>

      <div className="md:w-2/3 p-6 flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-600 mb-2">Email: <span className='text-sm text-gray-500'>{user.email || '-'}</span></p>
        <p className="text-sm font-medium text-gray-600 mb-2">Nomor Telepon: <span className='text-sm text-gray-500'>{user.no_telepon || '-'}</span></p>
        <p className="text-sm font-medium text-gray-600 mb-2">Kelas: <span className='text-sm text-gray-500'>{user.kelas || '-'}</span></p>
        <p className="text-sm font-medium text-gray-600 mb-2">Jenis Kelamin: <span className='text-sm text-gray-500'>{user.jenis_kelamin || '-'}</span></p>
        <p className="text-sm font-medium text-gray-600 mb-2">Angkatan: <span className='text-sm text-gray-500'>{user.angkatan || '-'}</span></p>
        {currentUserRole === 'pustakawan' && user.role !== 'pustakawan' && (
          <button
          onClick={() => handleDeleteClick(user.id_user)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-2 px-4 rounded-md w-fit"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

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
 
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-6 flex flex-col items-center pt-10">
      <h1 className="text-2xl font-bold mb-6 text-white">Daftar Anggota</h1>

      <div className="w-full max-w-6xl mb-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/dashboard/member/created')}
          className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Data Anggota
        </button>
        <button
          onClick={() => navigate('/dashboard/member/add')}
          className="block bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-sm w-full text-center"
        >
          Tambah Data Anggota
        </button>
      </div>

      <div className="w-full max-w-6xl mb-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama . . ."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="w-full max-w-6xl mt-2 mb-2">
        <div className="py-2 px-4 bg-white rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-600">Total Jumlah Anggota: {filteredUsers.length}</p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto mb-6"> 
        <div className="bg-white p-6 rounded-lg shadow-lg"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
                <UserCard key={user.id_user} user={user} currentUserRole={currentUserRole} /> 
              ))}
            </div>
           </div>
        </div>
            
            {selectedPhoto && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-white p-2 rounded-lg shadow-lg w-10/12 sm:w-3/4 md:w-1/3 lg:w-1/3 lg:max-w-lg mx-auto">
                  <img src={selectedPhoto} alt="Selected" className="max-w-full h-auto rounded-lg" />
                  <button
                    className="absolute top-0 right-0 m-1 text-gray-500 hover:text-gray-700 focus:outline-none rounded-full p-1 bg-white shadow-lg"
                    onClick={() => setSelectedPhoto(null)}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {showConfirmModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded shadow-2xl max-w-xs w-full p-6">
                  <h2 className="text-red-500 mb-4 text-center font-bold">Peringatan!</h2>
                  <p className="text-sm text-gray-600 text-center mb-5">Apakah Anda yakin ingin menghapus data anggota ini?</p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={deleteUser}
                      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    >
                      Cancel
                    </button>
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
      <ToastContainer/>
    </div>
  );
};

export default Member; 