import React from 'react'
import './index.css'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Login from './Components/Pages/Public/Login';
import Register from './Components/Pages/Public/Register';
import Products from './Components/Pages/Public/Products';
import Packages from './Components/Pages/Public/Packages';
import AdminPackages from './Components/Pages/admin/addpackages';
import Booking from './Components/Pages/Public/Booking';
import Dashboard from './Components/Pages/admin/Dashboard';
import AdminBookings from './Components/Pages/admin/Bookings';
import AdminProducts from './Components/Pages/admin/Products';
import EditPackage from './Components/Pages/admin/EditPackage';
export default function App() {
 
  return (
   <>
  <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/packages" element={<Packages />} />
             <Route path="/booking" element={<Booking />} /> 
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/packages/edit/:id" element={<EditPackage />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>  
   </>
  )
}
