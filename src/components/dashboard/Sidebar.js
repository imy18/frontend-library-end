// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaSignOutAlt, FaWalking, FaBars, FaBookOpen, FaCommentAlt } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser(); 
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      const token = response.data.accessToken;
      setToken(token);
      const decoded = jwtDecode(token);
      setExpire(decoded.exp);
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
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
        await axios.delete('http://localhost:5000/logout');
        navigate("/login");
    } catch (error) {
        console.log(error);
    }
}

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white space-y-6 py-7 px-2 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex flex-col items-center justify-center text-center w-full">
            {user ? (
              <>
                {user.foto ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.foto}`}
                    alt="User Profile"
                    className="h-16 w-16 rounded-full border-2 border-gray-300 mb-2"
                  />
                ) : (
                  <div
                    className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-300 border-2 border-gray-400 mb-2"
                  >
                    <span className="text-white text-lg font-semibold">
                      {user.name ? user.name[0] : '?'}
                    </span>
                  </div>
                )}
                <Link to="/dashboard/profil" className="text-base font-semibold">
                          {user.name}
                </Link> 
              </>
            ) : (
              <span className="text-gray-500">Tidak Ada Data</span>
            )}
          </div>
  
          <button onClick={toggleSidebar} className="text-white">
            <FaBars className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center py-4">
          <div className="flex flex-col items-center justify-center text-center w-full">
            {user ? (
              <>
                {user.foto ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.foto}`}
                    alt="User Profile"
                    className="h-16 w-16 rounded-full border-2 border-gray-300 mb-2"
                  />
                  
                ) : (
                  
                  <div
                    className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-300 border-2 border-gray-400 mb-2"
                  >
                    <span className="text-white text-lg font-semibold">
                      {user.name ? user.name[0] : '?'}
                    </span>
                    
                  </div>
                  
                )}
                <Link to="/dashboard/profil" className="text-base font-semibold">
                          {user.name}
                </Link>
                <div className="ml-2">
                  <p className="text-gray-800 text-base font-semibold">
                    {user.name || 'Nama Tidak Tersedia'}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-gray-500">No User Data</span>
            )}
          </div>
        </div>

        <nav className="mt-4">
        <hr className='mb-2'/>
        {user && user.role === 'pustakawan' && (
          <Link to="/dashboard/member" className={`mt-2 block py-2.5 px-4 rounded mb-2 transition duration-200 hover:bg-gray-700 hover:text-white 
            ${(location.pathname === '/dashboard/member' 
            || location.pathname === '/dashboard/member/created' 
            || location.pathname === '/dashboard/member/add') ? 'bg-blue-700 text-white' : ''}`}>
            <FaUser className="inline-block mr-3" /> Anggota
          </Link>
           )}

          <Link to="/dashboard/book" className={`block py-2.5 px-4 rounded mb-2 transition duration-200 hover:bg-gray-700 hover:text-white 
              ${location.pathname === '/dashboard/book' 
              || location.pathname === '/dashboard/book/add' 
              || location.pathname === '/dashboard/book/categorization' 
              || location.pathname === '/dashboard/book/label' 
              || location.pathname === '/dashboard/book/print'  
              || location.pathname === '/dashboard/book/recapitulation' 
              || location.pathname === '/dashboard/book/filter' 
              || location.pathname.startsWith('/dashboard/book/detail/' )   
              || location.pathname.startsWith('/dashboard/book/loan/' )  
              || location.pathname.startsWith('/dashboard/book/detail/edit/' ) ? 'bg-blue-700 text-white' : ''}`}>
            <FaBookOpen className="inline-block mr-3" /> Buku
          </Link>
          <Link to="/dashboard/loan" className={`block py-2.5 px-4 rounded mb-2 transition duration-200 hover:bg-gray-700 hover:text-white 
              ${location.pathname === '/dashboard/loan' 
              || location.pathname === '/dashboard/loan/loan-report' 
              || location.pathname === '/dashboard/loan/extension' 
              || location.pathname === '/dashboard/loan/report' 
              || location.pathname === '/dashboard/loan/insert-data' 
              || location.pathname.startsWith('/dashboard/loan/report/edit') 
              || location.pathname === '/dashboard/loan/search' ? 'bg-blue-700 text-white' : ''}`}>
            <FaBook className="inline-block mr-3" /> Peminjaman
          </Link>
          {user && user.role === 'pustakawan' && (
          <Link to="/dashboard/visit" className={`block py-2.5 px-4 rounded mb-2 transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname === '/dashboard/visit' 
            || location.pathname === '/dashboard/visit/barcode'
            || location.pathname === '/dashboard/visit/grafik'? 'bg-blue-700 text-white' : ''}`}>
            <FaWalking className="inline-block mr-3" /> Kunjungan
          </Link>
          )}
          {user && user.role === 'pustakawan' && (
          <Link to="/dashboard/criticism" className={`block py-2.5 px-4 rounded mb-2 transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname === '/dashboard/criticism' ? 'bg-blue-700 text-white' : ''}`}>
            <FaCommentAlt className="inline-block mr-3" /> Kritik & Saran
          </Link>
          )}
          
          <div>
            <hr />
            <div className="w-full flex justify-center mt-2">
              <button className="w-full max-w-xs py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white" onClick={handleLogout}>
                <FaSignOutAlt className="inline-block mr-3" /> Logout
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-0 w-full text-center py-2">
            <p className="text-gray-200 text-xs">
              &copy; 2024 imyproject. All rights reserved
            </p>
          </div>

        </nav>
      </div>
      <div className={`flex-1 md:ml-64 transition-all duration-200 ease-in-out`}>
        <button className="md:hidden flex items-center text-gray-800 absolute top-4 left-4" onClick={toggleSidebar}>
          <FaBars className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;