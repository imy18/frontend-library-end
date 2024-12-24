// Code was written by Muhammad Sindida Hilmy

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";

// Profil
import ResetPassword from "../components/dashboard/profil/ResetPassword/ResetPassword";
import Profile from "../components/dashboard/profil/Profil";
import EditProfil from "../components/dashboard/profil/EditProfil/EditProfil";

// Anggota
import CreatedAt from "../components/dashboard/member/CreatedAt/CreatedAt";
import Member from "../components/dashboard/member/Member";
import AddMember from "../components/dashboard/member/AddMember/AddMember";

// Buku
import FilterData from "../components/dashboard/book/FilterData/FilterData";
import DetailBook from "../components/dashboard/book/DetailBook/DetailBook";
import EditBook from "../components/dashboard/book/EditBook/EditBook";
import AddBook from "../components/dashboard/book/AddBook/AddBook";
import PrintData from "../components/dashboard/book/PrintData/PrintData";
import Recapitulation from "../components/dashboard/book/Recapitulation/Recapitulation";
import BookLabel from "../components/dashboard/book/BookLabel/BookLabel";
import Book from "../components/dashboard/book/Book";
import Categorization from "../components/dashboard/book/Categorization/Categorization";

// Peminjaman
import Extension from "../components/dashboard/loan/Extension/Extension";
import InsertData from "../components/dashboard/loan/InsertData/InsertData";
import Report from "../components/dashboard/loan/Report/Report";
import LoanReport from "../components/dashboard/loan/LoanReport/LoanReport";
import Update from "../components/dashboard/loan/Report/Update";
import SearchData from "../components/dashboard/loan/SearchData/SearchData"
import Loan from "../components/dashboard/loan/Loan";

// Kunjungan
import Visit from "../components/dashboard/visit/Visit";
import Grafik from "../components/dashboard/visit/Grafik/Grafik";
import Barcode from "../components/dashboard/visit/Barcode/Barcode";

// Kritik
import Criticism from "../components/dashboard/criticism/Criticism";

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
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
    } catch (error) {
      if (error.response) {
        navigate('/login');
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '10px' }}>
        <Routes>

          {/* Profil */}
          <Route path="profil" element={<Profile />} />
          <Route path="profil/reset-password" element={<ResetPassword />} />
          <Route path="profil/edit" element={<EditProfil />} />
          

          {/* Pengguna */}
          <Route path="member" element={<Member />} />
          <Route path="member/add" element={<AddMember />} />
          <Route path="member/created" element={<CreatedAt />} />

          {/* Buku */}
          <Route path="book/categorization" element={<Categorization />} />
          <Route path="book/filter" element={<FilterData />} />
          <Route path="book/detail/:id_buku" element={<DetailBook />} />
          <Route path="book/detail/edit/:id_buku" element={<EditBook />} />
          <Route path="book/recapitulation" element={<Recapitulation />} />
          <Route path="book/label" element={<BookLabel />} />
          <Route path="book/print" element={<PrintData />} />
          <Route path="book/add" element={<AddBook />} />
          <Route path="book" element={<Book />} />

          {/* Peminjaman */}
          <Route path="loan/report/edit/:id_pelaporan" element={<Update />} />
          <Route path="loan/report" element={<Report />} />
          <Route path="loan/insert-data" element={<InsertData />} />
          <Route path="loan/extension" element={<Extension />} />
          <Route path="loan/search" element={<SearchData />} />   
          <Route path="loan/loan-report" element={<LoanReport />} />
          <Route path="loan" element={<Loan />} />


          {/* Kunjungan */}
          <Route path="visit" element={<Visit />} />
          <Route path="visit/barcode" element={<Barcode />} />
          <Route path="visit/grafik" element={<Grafik />} />

          {/* Kritik */}
          <Route path="criticism" element={<Criticism />} />

          {/* Non Pustakawan */}
          <Route path="book/loan/:id_buku" element={<InsertData />} />

          <Route path="/" element={<Navigate to="book" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;