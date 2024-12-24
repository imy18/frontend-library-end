// Code was written by Muhammad Sindida Hilmy

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../../assets/img/landingPage/header.jpeg'; 

function HeaderSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 3) {
      setSearchResults([]);
      setNotFound(false);
      return; 
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/buku/search?judul=${searchTerm}`);
      const data = await response.json();
      if (data.buku.length === 0) {
        setNotFound(true);
        setSearchResults([]);
      } else {
        setSearchResults(data.buku);
        setNotFound(false);
      }
    } catch (error) {
      console.error('Error saat melakukan pencarian:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim().length < 3) {
      setSearchResults([]);
      setNotFound(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchTerm('');
    setNotFound(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-6 lg:px-6 pt-12 sm:pt-6 pb-6 sm:pb-6" id="opac" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-2xl w-full mx-auto mb-2">
        <h2 className="text-4xl font-semibold mb-6 text-center text-white">OPAC</h2>
        <div className="flex flex-col items-center relative">
          <input
            type="text"
            placeholder="Cari buku . . ."
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="mx-auto w-full lg:w-6/7 bg-gray-100 text-gray-800 px-4 py-3 rounded-full shadow-md focus:outline-none focus:bg-white focus:text-gray-900 text-lg"
          />
          {searchResults.length === 0 && !notFound && (
            <button
              onClick={handleSearch}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              {loading ? 'Loading...' : 'Cari'}
            </button>
          )}
        </div>
        
        <div className="mt-2">
          {notFound ? (
            <div className="bg-white rounded-lg p-4 relative mx-auto">
              <button
                onClick={clearSearchResults}
                className="absolute right-0 top-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-sm font-semibold text-center text-red-400">Buku dengan judul yang Anda cari tidak ada.</p>
            </div>
          ) : (
            searchResults.length > 0 && (
              <div className="bg-white rounded-lg p-4 relative">
                <button
                  onClick={clearSearchResults}
                  className="absolute right-0 top-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((buku) => (
                    <div
                      key={buku.judul}
                      className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden shadow-lg p-2 hover:bg-gray-100 transition-colors"
                    >
                      {buku.foto ? (
                        <img 
                          src={`http://localhost:5000/uploadBook/${buku.foto}`} 
                          alt={buku.judul} 
                          className="w-full h-48 object-cover" 
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-12 h-12 text-gray-500"
                          >
                            <path d="M21 4H7a2 2 0 00-2 2v12a2 2 0 002 2h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 13H7V6h13v11zM5 18H4V6H3v13a1 1 0 001 1h13v-1H5z" />
                          </svg>
                        </div>
                      )}

                      <div className="p-2">
                        <h3 className="text-sm font-semibold mb-1">{buku.judul}</h3>
                        <p className="text-xs text-gray-600">{buku.penulis}</p>
                        <Link to={`/detail/${buku.id_buku}`}>
                          <button className="mt-2 w-full text-white font-semibold text-xs py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600">
                            Detail
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderSection;