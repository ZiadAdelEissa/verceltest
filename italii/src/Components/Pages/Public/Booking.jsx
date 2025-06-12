import { useState, useEffect } from 'react';
import { createBooking, getProducts,getBookingById } from '../../Api/carwashapi.js';
import AnimatedButton from '../../AnimationButton/AnimatedButton.jsx';
import { useAuth } from '../../AuthContext/AuthContext.jsx';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';

export default function Booking() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const { user } = useAuth();
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchBooking = async () => {
      try {
        const response = await getBookingById();
        setBookingId(response.data.id);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking,
    fetchProducts();
  }, []);

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bookingData = {
        userId: user._id,
        products: selectedProducts.map(id => ({ productId: id, quantity: 1 })),
        bookingDate: new Date(`${date}T${time}`),
      };
      
      const response = await createBooking(bookingData);
      setBookingId(response.data._id);
      setSuccess(true);
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    return <LoadingSpinner />;
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
        <p className="mb-4">Your booking ID is: {bookingId}</p>
        <AnimatedButton onClick={() => setSuccess(false)}>
          Make Another Booking
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      className="container mx-auto px-4 py-8  translate-y-6 transition duration-500"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Book Your Car Wash</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="time">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Products</label>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`product-${product._id}`}
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleProductSelect(product._id)}
                  className="mr-2"
                />
                <label htmlFor={`product-${product._id}`}>
                  {product.name} - ${product.price}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <AnimatedButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </AnimatedButton>
      </form>
    </div>
  );
}