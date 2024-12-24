// Code was written by Muhammad Sindida Hilmy

import React from 'react';

function RulesSection() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 p-8" id="rules">
            <div className="max-w-6xl w-full bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-extrabold mb-8 text-center text-gray-800">Peraturan Umum Perpustakaan</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg">
                            Pengunjung perpustakaan wajib mengisi buku kunjungan perpustakaan.
                        </li>
                        <li className="text-lg">
                            Pengunjung perpustakaan dilarang membawa tas/makanan ke dalam ruang perpustakaan. Mengganggu sesama pengunjung dengan suara gaduh.
                        </li>
                        <li className="text-lg">
                            Pengunjung diharap tertib di dalam ruang perpustakaan.
                        </li>
                        <li className="text-lg">
                            Pengunjung dilarang mengenakan topi di dalam ruang perpustakaan.
                        </li>
                        <li className="text-lg">
                            Pengunjung selesai membaca buku, majalah, surat kabar, dan lain-lain harus mengembalikan pada tempat semula.
                        </li>
                    </ul>
                    
                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg">
                            Pengunjung dilarang mencoret-coret, menggunting, menyobek buku dan lain-lain milik perpustakaan.
                        </li>
                        <li className="text-lg">
                            Bila jam kosong siswa/siswi diperbolehkan belajar di ruang perpustakaan.
                        </li>
                        <li className="text-lg">
                            Pengunjung dilarang masuk ke perpustakaan sebelum diijinkan oleh petugas perpustakaan.
                        </li>
                        <li className="text-lg">
                            Pengunjung dilarang merokok di ruang perpustakaan.
                        </li>
                        <li className="text-lg">
                            Dilarang mengobrol dan bermain-main di perpustakaan.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RulesSection;