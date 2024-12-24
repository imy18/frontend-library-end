// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom";

function DetailBook() {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [bookDetails, setBookDetails] = useState({});
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const { id_buku } = useParams();

  useEffect(() => {
    refreshToken();
    detailBuku();
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

  const detailBuku = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buku/detail/${id_buku}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookDetails(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const formatKey = (key) => {
    if (key === 'dcc') {
      return key.toUpperCase();
    }
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Non Pustakawan
  if (role !== 'pustakawan') {
    return (
      <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-16">
              <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{bookDetails.judul}</h1>
              {!bookDetails.foto || bookDetails.foto === '-' ? (
                <div
                  className="rounded-lg w-full lg:w-48 h-auto max-h-72 bg-gray-200 flex items-center justify-center mb-4 lg:mb-0 lg:mr-8"
                  style={{ aspectRatio: '2 / 3' }} 
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-24 h-24 text-gray-400"
                  >
                    <path d="M21 4H7a2 2 0 00-2 2v12a2 2 0 002 2h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 13H7V6h13v11zM5 18H4V6H3v13a1 1 0 001 1h13v-1H5z" />
                  </svg>
                </div>
              ) : (
                <img
                  src={`http://localhost:5000/uploadBook/${bookDetails.foto}`}
                  alt="Book cover"
                  className="rounded-lg w-full lg:w-48 h-64 object-cover object-center"
                />  
              )}
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(bookDetails)
                  .filter((key) => key !== 'judul' && key !== 'foto')
                  .map((key) => (
                    <div key={key}>
                      <p className="text-md font-medium text-gray-600">{formatKey(key)}:</p>
                      <p className="text-md text-gray-500">{bookDetails[key] || '-'}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
            onClick={() => navigate(`/dashboard/book/loan/${id_buku}`)}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Pinjam
            </button>
            <button className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
              type="button" 
              onClick={() => navigate(-1)}>Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  // End

  return (
  <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-16">
              <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">{bookDetails.judul}</h1>
              {!bookDetails.foto || bookDetails.foto === '-' ? (
              <div
                className="rounded-lg w-full lg:w-48 h-auto max-h-72 bg-gray-200 flex items-center justify-center mb-4 lg:mb-0 lg:mr-8"
                style={{ aspectRatio: '2 / 3' }} 
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-24 h-24 text-gray-400"
                >
                  <path d="M21 4H7a2 2 0 00-2 2v12a2 2 0 002 2h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 13H7V6h13v11zM5 18H4V6H3v13a1 1 0 001 1h13v-1H5z" />
                </svg>
              </div>
            ) : (
                  <img
                    src={`http://localhost:5000/uploadBook/${bookDetails.foto}`}
                    alt="Book cover"
                    className="rounded-lg w-full lg:w-48 h-64 object-cover object-center"
                  />
                  
                )}
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(bookDetails)
                  .filter((key) => key !== 'judul' && key !== 'foto')
                  .map((key) => (
                    <div key={key}>
                      <p className="text-md font-medium text-gray-600">{formatKey(key)}:</p>
                      <p className="text-md text-gray-500">{bookDetails[key] || '-'}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => navigate(`/dashboard/book/detail/edit/${id_buku}`)} 
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
            >
              Edit Data
            </button>
            <button className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
              type="button" 
              onClick={() => navigate(-1)}>Back
            </button>
          </div>
        </div>
      </div>
    )
  }

export default DetailBook