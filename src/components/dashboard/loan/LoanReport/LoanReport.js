// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const LoanReport = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [reportData, setReportData] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState('totalPerBulan');
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 300) { 
            setShowScrollTopButton(true);
        } else {
            setShowScrollTopButton(false);
        }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll); 
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      getData(response.data.accessToken, selectedReportType);
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  const getData = async (token, type) => {
    try {
      const response = await axios.get(`http://localhost:5000/peminjaman/report?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Data received:', response.data);
      setReportData(response.data.reportData || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      setReportData({});
    }
  };

  const handleReportTypeChange = (type) => {
    setSelectedReportType(type);
    setIsOpen(false);
    if (token) {
      getData(token, type);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePrint = () => {
    window.print();
  };

  return ( 
    <div className="min-h-screen p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
      <h1 className="mt-5  text-2xl font-bold mb-6 text-white text-center print:hidden">Laporan Data Peminjaman</h1>
      <div className="w-full flex justify-center  print:hidden">

      <div className=" flex flex-col items-center w-full">
        <button
          onClick={toggleDropdown}
          className="relative bg-gray-200 text-gray-800 flex justify-between items-center py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full sm:max-w-sm"
        >
          <span className="w-full text-center">
                  {selectedReportType === 'totalPerBulan' && 'Total Peminjaman Per Bulan'}
                  {selectedReportType === 'bukuPalingSeringDipinjam' && 'Buku Paling Sering Dipinjam'}
                  {selectedReportType === 'keterlambatan' && 'Laporan Keterlambatan'}
                  {(!selectedReportType) && 'Pilih Tipe Laporan'}
                  </span>
                  <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
          
          {isOpen && (
            <div className="mt-1 w-full sm:max-w-sm bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-1 flex flex-col space-y-2">
              <button
                  onClick={() => { handleReportTypeChange('totalPerBulan'); setIsOpen(false); }}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center rounded-lg"
                >
                  Total Peminjaman Per Bulan
                </button>

                <button
                  onClick={() => { handleReportTypeChange('bukuPalingSeringDipinjam'); setIsOpen(false); }}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center rounded-lg"
                >
                  Buku Paling Sering Dipinjam
                </button>

                <button
                  onClick={() => { handleReportTypeChange('keterlambatan'); setIsOpen(false); }}
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center rounded-lg"
                >
                  Laporan Keterlambatan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 max-w-6xl mx-auto">
        <div className="w-full flex flex-col lg:flex-row justify-between mt-4 space-y-4 lg:space-y-0 lg:space-x-4 print:hidden mb-6">
          <button
            onClick={handlePrint}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Print
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-6xl mx-auto">
        {selectedReportType === 'totalPerBulan' && reportData && (
          <div>
            <h2 className="text-gray-700 font-semibold mb-4 text-center">Total Peminjaman Per Bulan</h2>
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border w-1/6 px-4 py-2 text-sm font-medium text-gray-600 text-center">Bulan</th>
                  <th className="border w-1/6 px-4 py-2 text-sm font-medium text-gray-600 text-center">Total Peminjaman</th>
                  <th className="border w-1/6 px-4 py-2 text-sm font-medium text-gray-600 text-center">Total Buku Dipinjam</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border w-1/6 px-4 py-2 text-sm text-gray-700 truncate">{item.bulan}</td>
                      <td className="border w-1/6 px-4 py-2 text-sm text-gray-700 truncate">{item.totalPeminjaman}</td>
                      <td className="border w-1/6 px-4 py-2 text-sm text-gray-700 truncate">{item.totalBukuDipinjam}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border px-4 py-2 text-center text-sm text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedReportType === 'bukuPalingSeringDipinjam' && reportData && (
          <div className="">
            <h2 className="text-gray-700 font-semibold mb-4 text-center">Buku Paling Sering Dipinjam</h2>
            {reportData.length > 0 ? (
              reportData.map((report, index) => (
                <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
                  <h3 className="font-medium text-gray-500 mb-2">{report.reportData}</h3>
                  <ul className="space-y-4">
                    {report.data && report.data.map((item, i) => (
                      <li key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-start items-center border-b border-gray-200 pb-2">
                            <span className="text-sm font-medium text-gray-600 mr-2">Judul:</span>
                            <span className='text-sm text-gray-700 truncate'>{item.judulBuku}</span>
                          </div>
                          <div className="flex justify-start items-center border-b border-gray-200 pb-2">
                            <span className="text-sm font-medium text-gray-600 mr-2">Total Peminjaman:</span>
                            <span className='text-sm text-gray-700 truncate'>{item.totalPeminjaman}</span>
                          </div>
                          <div className="flex justify-start items-center">
                            <span className="text-sm font-medium text-gray-600 mr-2">Total Buku Dipinjam:</span>
                            <span className='text-sm text-gray-700 truncate'>{item.totalBukuDipinjam}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Tidak ada data</p>
            )}
          </div>
        )}

        {selectedReportType === 'keterlambatan' && reportData && (
          <div>
            <h2 className="text-gray-700 font-semibold mb-4 text-center">Laporan Keterlambatan</h2>
            {reportData.monthlyTotal && reportData.monthlyTotal.length > 0 ? (
              reportData.monthlyTotal.map((item, index) => (
                <div key={index} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-md">
                  <h3 className="font-medium text-gray-500 mb-2">
                    Bulan: {item.bulanPeminjaman}, Tahun: {item.tahunPeminjaman}
                  </h3>

                  <h3 className="font-medium text-gray-500 mb-2">
                    Total Peminjaman: {item.total}
                  </h3>
                  {item.data && item.data.map((detail, i) => (
                    <div key={i} className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                        <div className="pb-2 border-b border-gray-300">
                          <p className="text-sm font-medium text-gray-600 mb-1">Nama:</p>
                          <p className="text-sm text-gray-700 truncate">{detail.user.name}</p>
                        </div>

                        <div className="pb-2 border-b border-gray-300">
                          <p className="text-sm font-medium text-gray-600 mb-1">Kelas:</p>
                          <p className="text-sm text-gray-700 truncate">{detail.user.kelas}</p>
                        </div>

                        <div className="pb-2 border-b border-gray-300">
                          <p className="text-sm font-medium text-gray-600 mb-1">No Telepon:</p>
                          <p className="text-sm text-gray-700 truncate">{detail.user.no_telepon}</p>
                        </div>
                      </div>

                      <div className="border-t-4 border-gray-200 my-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Judul Buku:</p>
                            <p className="text-sm text-gray-700 truncate">{detail.buku.judul}</p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Status Peminjaman:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.status_peminjaman 
                                ? detail.status_peminjaman
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                : '-'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Tanggal Peminjaman:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.tanggal_peminjaman ? (
                                new Date(detail.tanggal_peminjaman).toLocaleDateString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              ) : 'Tanggal tidak valid'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Tanggal Perpanjangan:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.tanggal_perpanjangan ? (
                                new Date(detail.tanggal_perpanjangan).toLocaleDateString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              ) : '-'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Tanggal Pengembalian:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.tanggal_pengembalian ? (
                                new Date(detail.tanggal_pengembalian).toLocaleDateString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              ) : '-'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Tanggal Pengembalian Aktual:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.tanggal_pengembalian_aktual ? (
                                new Date(detail.tanggal_pengembalian_aktual).toLocaleDateString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })
                              ) : '-'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Denda:</p>
                            <p className="text-sm text-gray-700 truncate">
                              {detail.denda ? new Intl.NumberFormat('id-ID', { 
                                style: 'currency', 
                                currency: 'IDR',
                                minimumFractionDigits: 0, 
                                maximumFractionDigits: 0  
                              }).format(detail.denda) : 'Rp 0'}
                            </p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Jumlah Buku:</p>
                            <p className="text-sm text-gray-700 truncate">{detail.jumlah_pinjaman}</p>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">Catatan:</p>
                            <p className="text-sm text-gray-700">{detail.catatan || '-'}</p>
                          </div>

                          <div className="pb-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Jumlah Pengembalian Terlambat:</p>
                            <p className="text-sm text-gray-700 truncate">{detail.jumlah_pengembalian_terlambat}</p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default LoanReport;