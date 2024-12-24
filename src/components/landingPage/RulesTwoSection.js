// Code was written by Muhammad Sindida Hilmy

import React from 'react';

function RulesTwoSection() {
    return (
        <div className="flex items-center justify-center min-h-screen p-8">
            <div className="max-w-6xl w-full bg-gray-400 shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-extrabold mb-8 text-center text-white">Peraturan Khusus Perpustakaan</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg">
                            Peminjam harus mengembalikan buku sesuai dengan batas waktu yang ditentukan.
                        </li>
                        <li className="text-lg">
                            Peminjam buku bisa diperpanjang.
                        </li>
                        <li className="text-lg">
                            Peminjam maksimal satu exemplar judul buku.
                        </li>
                    </ul>

                    <ul className="list-disc list-inside space-y-4">
                        <li className="text-lg">
                            Peminjam yang melebihi batas waktu maksimal tanpa pemberitahuan kepada petugas, dikenakan denda Rp. 500,00 per hari.
                        </li>
                        <li className="text-lg">
                            Peminjam dilarang memberikan coret-coretan pada buku yang dipinjam.
                        </li>
                        <li className="text-lg">
                            Peminjam dilarang menghilangkan buku/ halaman buku yang dipinjam.
                        </li>
                        <li className="text-lg">
                            Buku-buku referensi yang jumlahnya terbatas tidak bisa dipinjam untuk dibawa pulang.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RulesTwoSection;