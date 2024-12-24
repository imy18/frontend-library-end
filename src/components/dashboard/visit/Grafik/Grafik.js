// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css'; 
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Grafik = () => {
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [error, setError] = useState('');
    const [dataKunjungan, setDataKunjungan] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setExpire(decoded.exp);
            getData(response.data.accessToken);
        } catch (error) {
            if (error.response) {
                navigate('/login');
            }
        }
    };

    const getData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/kunjungan', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataKunjungan(response.data.data);
        } catch (error) {
            setError('Terjadi kesalahan saat mendapatkan data kunjungan');
            console.error('Error saat mendapatkan data kunjungan:', error);
        }
    };

    // Ekstraksi daftar tahun yang unik dari data kunjungan
    const availableYears = Array.from(new Set(dataKunjungan.map(item => new Date(item.tanggal_kunjungan).getFullYear())));

    // Filter data kunjungan berdasarkan tahun yang dipilih
    const filteredDataKunjungan = selectedYear
        ? dataKunjungan.filter(item => new Date(item.tanggal_kunjungan).getFullYear() === parseInt(selectedYear))
        : dataKunjungan;

    // Mengelompokkan data kunjungan per bulan untuk tahun yang dipilih
    const kunjunganBulanan = filteredDataKunjungan.reduce((acc, item) => {
        const tanggal = new Date(item.tanggal_kunjungan);
        const bulan = tanggal.toLocaleString("id-ID", { month: "long" });
        const bulanTahun = `${bulan} ${selectedYear || tanggal.getFullYear()}`;

        if (!acc[bulanTahun]) {
            acc[bulanTahun] = 0;
        }
        acc[bulanTahun] += item.jumlah || 1;
        return acc;
    }, {});
    

    // Mengonversi hasil pengelompokan ke dalam format untuk Chart.js
    const labels = Object.keys(kunjunganBulanan);
    const dataKunjunganPerBulan = Object.values(kunjunganBulanan);

    const data = {
        labels,
        datasets: [
            {
                label: "Jumlah Kunjungan",
                data: dataKunjunganPerBulan,
                backgroundColor: "rgba(75, 192, 192, 0.5)"
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(75, 85, 99, 1)'
                }
            },
            title: {
                display: true,
                text: `Jumlah Kunjungan per Bulan ${selectedYear ? `Tahun ${selectedYear}` : ''}`,
                color: 'rgba(75, 85, 99, 1)',
                font: {
                    size: 18
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(75, 85, 99, 1)'
                }
            },
            y: {
                ticks: {
                    color: 'rgba(75, 85, 99, 1)',
                    beginAtZero: true
                }
            }
        }
    };

    const totalKunjungan = dataKunjunganPerBulan.reduce((acc, curr) => acc + curr, 0);
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto min-h-screen px-6 sm:px-11 py-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
            <div className="w-full max-w-6xl lg:max-w-6xl bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Grafik Kunjungan Perpustakaan</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 max-w-6xl mx-auto mb-4">
                        <div className="w-full flex flex-col lg:flex-row justify-between mt-4 space-y-4 lg:space-y-0 lg:space-x-4 print:hidden ">
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
                
                <div className="block text-gray-100 text-sm font-semibold mb-2 print:hidden">
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-gray-200 text-center text-gray-800 block py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full max-w-xs mx-auto"
                    >
                        <option value="">Semua Tahun</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="print-container">
                    <div className="relative w-full">
                        <div className="w-full max-w-2xl mx-auto h-48 sm:h-64 md:h-[250px] lg:h-[300px]">
                            <Bar
                                data={data}
                                options={{
                                    ...options,
                                    maintainAspectRatio: false, 
                                }}
                            />
                        </div>
                    </div>

                    <h3 className="text-md font-semibold mb-2 mt-6 text-center sm:text-left">Keterangan:</h3>
                    {selectedYear ? (
                        <>
                            <ul className="text-xs mb-2 space-y-1">
                                {labels.map((label, index) => (
                                    <li 
                                        key={label} 
                                        className="text-xs sm:text-sm text-gray-700 border-b border-gray-200 pb-1"
                                    >
                                        {`${label}: ${dataKunjunganPerBulan[index]} kunjungan`}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs sm:text-sm text-gray-700 border-b border-gray-200 pb-1">
                                {`Total: ${totalKunjungan} kunjungan pada tahun ${selectedYear}`}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left mt-4">
                            Pilih tahun untuk melihat rincian kunjungan.
                        </p>
                    )}
                </div>
            </div>

            <style>
                {`
                    @media print {
                        /* Menyembunyikan elemen-elemen yang tidak perlu saat print */
                        body * {
                            visibility: hidden;
                        }

                        /* Menampilkan hanya div yang membungkus grafik dan keterangan */
                        .print-container, .print-container * {
                            visibility: visible;
                        }

                        /* Menambahkan jarak antar elemen untuk print */
                        .print-container {
                            width: 100% !important;
                            padding: 0 !important;
                            margin: 0 auto !important;
                        }

                        /* Menambahkan style agar grafik terlihat dengan baik */
                        .print-container .w-full, .print-container .h-48, .print-container .sm:h-64, .print-container .md:h-[250px], .print-container .lg:h-[300px] {
                            margin-bottom: 20px;
                        }

                        /* Menambahkan jarak dan pembatas di bawah tiap item keterangan */
                        .print-container .text-md, .print-container .font-semibold, .print-container .text-center, .print-container .sm\:text-left, .print-container .mb-2, .print-container .text-sm, .print-container .text-base, .print-container .space-y-1 {
                            margin-bottom: 10px;
                        }

                        /* Menyembunyikan tombol, dropdown, dan background saat print */
                        .print-hidden {
                            display: none !important;
                        }

                        /* Mengatur margin untuk hasil print */
                        body {
                            margin: 0 !important;
                            padding: 20px !important;
                        }
                    }
                `}
            </style>
        </div>
    );

};

export default Grafik;