// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function BukuSection() {
  const [dataBuku, setDataBuku] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/buku');
        const data = await response.json();
        setDataBuku(data.buku);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const sliderSettings = {
    dots: false, 
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-black rounded-full`}
        style={{
          ...style,
          left: '-30px',
          backgroundColor: 'gray', 
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={onClick}
      >
      </div>
    );
  }

  function CustomNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-black rounded-full`}
        style={{
          ...style,
          right: '-30px',
          backgroundColor: 'gray',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={onClick}
      >
      </div>
    );
  }

  return (
    <div className="bg-white" id="book">
      <div className="container mx-auto px-14 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Daftar Buku</h2>
        <Slider {...sliderSettings} className="mx-auto">
          {dataBuku.map(buku => (
            <div key={buku.id} className="px-2">
              <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden shadow-lg p-2 hover:bg-gray-100 transition-colors">
              {buku.foto ? (
                <img src={`http://localhost:5000/uploadBook/${buku.foto}`}  alt={buku.judul} className="w-full h-48 object-cover" />
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
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default BukuSection;