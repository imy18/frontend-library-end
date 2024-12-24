// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailBookL() {
  const { id_buku } = useParams();
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/buku/detail/${id_buku}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book data');
        }
        const data = await response.json();
        const sanitizedData = sanitizeBookData(data);
        setBookDetail(sanitizedData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id_buku]);

  const sanitizeBookData = (data) => {
    const sanitizedData = {};
    for (let key in data) {
      sanitizedData[key] = data[key] || '-';
    }
    return sanitizedData;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-200 to-gray-400"><p className="text-lg">Loading...</p></div>;
  }

  const formatKey = (key) => {
    if (key === 'dcc') {
      return key.toUpperCase();
    }
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {bookDetail.judul}
        </h1>
        <div className="flex flex-col lg:flex-row items-start lg:items-start">
          {!bookDetail.foto || bookDetail.foto === '-' ? (
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
              src={`http://localhost:5000/uploadBook/${bookDetail.foto}`}
              alt="Book cover"
              className="rounded-lg w-full lg:w-48 h-auto max-h-72 object-cover object-center mb-4 lg:mb-0 lg:mr-8"
              style={{ aspectRatio: '2 / 3' }} 
            />
          )}
          
          <div className="flex-grow w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {Object.keys(bookDetail)
                .filter((key) => key !== 'judul' && key !== 'foto')
                .map((key) => (
                  <div key={key} className="w-full text-left">
                    <p className="text-md font-medium text-gray-600">{formatKey(key)}:</p>
                    <p className="text-md text-gray-500">{bookDetail[key] || '-'}</p>
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
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default DetailBookL;