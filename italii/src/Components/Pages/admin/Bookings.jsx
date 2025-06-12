import { useState, useEffect } from 'react';
import { getBookings, scanQR } from '../../Api/carwashapi.js';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = async (bookingId) => {
    if (window.confirm('Confirm this booking has been completed?')) {
      try {
        await scanQR(bookingId);
        fetchBookings();
      } catch (error) {
        console.error('Error scanning QR:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      ref={sectionRef}
      className="container mx-auto px-4 py-8 translate-y-6 transition duration-500"
    >
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.userId?.username}</div>
                  <div className="text-sm text-gray-500">{booking.userId?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.packageId ? (
                    <div className="text-sm font-medium text-gray-900">{booking.packageId.name}</div>
                  ) : (
                    <div className="text-sm text-gray-500">Custom</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleScanQR(booking._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}