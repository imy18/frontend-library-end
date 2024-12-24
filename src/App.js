// Code was written by Muhammad Sindida Hilmy

import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.js";
import Register from "./components/auth/register/Register.js";
import Login from "./components/auth/login/Login.js";
import Dashboard from "./pages/Dashboard.js";
import DetailBookL from "./components/landingPage/searchBar/DetailBookL.js";
import Form from "./components/dashboard/visit/Form/Form.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<LandingPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/detail/:id_buku" element={<DetailBookL />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/form' element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;