import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById, updatePackage, getProducts } from '../../Api/carwashapi.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';

export default function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    image: '',
    includes: []
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageRes, productsRes] = await Promise.all([
          getPackageById(id),
          getProducts()
        ]);
        setPackageData(packageRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleProductInclusion = (productId) => {
    setPackageData(prev => {
      const existingIndex = prev.includes.findIndex(item => item.productId === productId);
      if (existingIndex >= 0) {
        return {
          ...prev,
          includes: prev.includes.filter(item => item.productId !== productId)
        };
      } else {
        return {
          ...prev,
          includes: [...prev.includes, { productId, quantity: 1 }]
        };
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setPackageData(prev => ({
      ...prev,
      includes: prev.includes.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data in the correct format
      const formattedData = {
        name: packageData.name,
        description: packageData.description,
        price: Number(packageData.price),
        duration: Number(packageData.duration),
        image: packageData.image,
        includes: packageData.includes.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity)
        }))
      };
  
      console.log('Submitting:', formattedData); // Debug log
  
      const response = await updatePackage(id, formattedData);
      
      if (response.status === 200) {
        alert('Package updated successfully!');
        navigate('/admin/packages');
      }
    } catch (error) {
      console.error('Full error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert(`Failed to update package: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Package</h1>
        <button
          onClick={() => navigate('/admin/packages')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Back to Packages
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Name</label>
            <input
              type="text"
              value={packageData.name}
              onChange={(e) => setPackageData({...packageData, name: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={packageData.description}
              onChange={(e) => setPackageData({...packageData, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={packageData.price || 0}
                onChange={(e) => setPackageData({...packageData, price: parseFloat(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={packageData.duration || 30}
                onChange={(e) => setPackageData({...packageData, duration: parseInt(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={packageData.image}
              onChange={(e) => setPackageData({...packageData, image: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Included Products</label>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
              {products.map(product => (
                <div key={product._id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={packageData.includes.some(item => item.productId === product._id)}
                      onChange={() => toggleProductInclusion(product._id)}
                      className="mr-2"
                    />
                    <span>{product.name}</span>
                  </div>
                  {packageData.includes.some(item => item.productId === product._id) && (
                    <input
                      type="number"
                      min="1"
                      value={packageData.includes.find(item => item.productId === product._id)?.quantity || 1}
                      onChange={(e) => updateQuantity(product._id, parseInt(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Package'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}