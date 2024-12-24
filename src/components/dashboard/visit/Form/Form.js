// Code was written by Muhammad Sindida Hilmy

import React, { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Form = () => {
    const [nama, setNama] = useState("");
    const [error, setError] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const recaptchaRef = useRef(null); // Ref untuk reCAPTCHA

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!captchaValue) {
            setError('Silakan verifikasi bahwa Anda bukan robot.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/kunjungan/form", {
                nama_pengunjung: nama,
                captcha: captchaValue,
            });
            setNama(""); 
            setCaptchaValue(null);
            recaptchaRef.current.reset(); // Reset tampilan reCAPTCHA
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || "Gagal mencatat kehadiran";
            setError(errorMessage);
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 min-h-screen flex items-center justify-center px-6 sm:px-6 lg:px-6 pt-12 sm:pt-6 pb-6 sm:pb-6">
            <div className="max-w-2xl w-full mx-auto mb-2">
                <div className="bg-white border rounded-md shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Form Kehadiran</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                                Nama
                            </label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Nama"
                            />
                        </div>
                        {error && (
                            <p className="mb-2 text-white text-sm mt-2 p-2 bg-red-500 bg-opacity-50 border border-red-400 rounded-md shadow-sm text-center">
                                {error}
                            </p>
                        )}
                        <div className="flex justify-start mb-4">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6LfQV3UqAAAAANI5Qit-ijg9vR3QRfg0qlenONeO" // Ganti dengan site key dari Google reCAPTCHA
                                onChange={(value) => setCaptchaValue(value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                        >
                            Kirim
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Form;