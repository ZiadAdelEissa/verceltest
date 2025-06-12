import { useState, useEffect } from 'react';
import { getBookings, getPackages, getProducts } from '../../Api/carwashapi.js';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activePackages: 0,
    availableProducts: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, packagesRes, productsRes] = await Promise.all([
          getBookings(),
          getPackages(),
          getProducts()
        ]);
        
        const pendingBookings = bookingsRes.data.filter(b => b.status === 'pending').length;
        const availableProducts = productsRes.data.reduce((sum, product) => sum + product.stock, 0);
        
        setStats({
          totalBookings: bookingsRes.data.length,
          activePackages: packagesRes.data.length,
          availableProducts,
          pendingBookings
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      ref={sectionRef}
      className="container mx-auto px-4 py-8  translate-y-6 transition duration-500"
    >
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Packages</h3>
          <p className="text-3xl font-bold">{stats.activePackages}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Available Products</h3>
          <p className="text-3xl font-bold">{stats.availableProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Bookings</h3>
          <p className="text-3xl font-bold">{stats.pendingBookings}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <a 
            href="/admin/products" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Manage Products
          </a>
          <a 
            href="/admin/packages" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Manage Packages
          </a>
          <a 
            href="/admin/bookings" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Bookings
          </a>
        </div>
      </div>
    </div>
  );
}