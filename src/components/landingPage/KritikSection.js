// Code was written by Muhammad Sindida Hilmy

import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

const KirimKritikSaran = () => {
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null); // Ref untuk reCAPTCHA

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subjek.trim()) {
      setErrorMessage('Subjek wajib diisi.');
      return;
    }

    if (!isi.trim()) {
      setErrorMessage('Isi wajib diisi.');
      return;
    }

    if (!captchaValue) {
      setErrorMessage('Silakan verifikasi bahwa Anda bukan robot.');
      return;
    }

    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/kritiksaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjek: subjek,
          isi: isi,
          captcha: captchaValue,
        }),
      });
      toast.success('Kritik dan saran berhasil dikirim.', {
        position: "top-center",
        autoClose: 2000
      });
      setSubjek('');
      setIsi('');
      setCaptchaValue(null);
      recaptchaRef.current.reset();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  {return (
    <section className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center py-12 px-7 sm:px-6 lg:px-8" id="feedback">
      <div className="max-w-6xl w-full space-y-8 border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Beri Kritik dan Saran
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4"> 
          <div>
            <label htmlFor="subjek" className="block text-gray-700 text-sm font-bold mb-2">Subjek</label>
            <input
              type="text"
              id="subjek"
              value={subjek}
              onChange={(e) => setSubjek(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${errorMessage === 'Subjek wajib diisi.' ? 'border-red-500' : ''}`}
              placeholder="Masukkan subjek kritik atau saran"
            />
          </div>

          <div>
            <label htmlFor="isi" className="block text-gray-700 text-sm font-bold mb-2">Isi</label>
            <textarea
              id="isi"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${errorMessage === 'Isi wajib diisi.' ? 'border-red-500' : ''}`}
              rows="4"
              placeholder="Masukkan isi kritik atau saran"
            ></textarea>
          </div>

          {errorMessage && (
            <p className="text-white text-sm p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center m-0">
              {errorMessage}
            </p>
          )}

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfQV3UqAAAAANI5Qit-ijg9vR3QRfg0qlenONeO" 
            onChange={(value) => setCaptchaValue(value)} // simpan nilai reCAPTCHA
          />

          <div className="flex justify-start items-center w-full m-0 p-0">
            <button
              type="submit"
              className="w-full sm:w-auto py-2 px-12 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Kirim
            </button>
          </div>

        </form>
      </div>
      <ToastContainer/>
    </section>
  )}
  
};

export default KirimKritikSaran;