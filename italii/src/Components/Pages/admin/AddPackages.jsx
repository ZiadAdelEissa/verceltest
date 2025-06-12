import { useState, useEffect } from 'react';
import { getPackages, getProducts, createPackage, deletePackage } from '../../Api/carwashapi.js';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';
import Modal from '../../modal/Modal.jsx';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    image: '',
    includes: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, productsRes] = await Promise.all([
        getPackages(),
        getProducts()
      ]);
      setPackages(packagesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        setPackages(packages.filter(pkg => pkg._id !== id));
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleAddPackage = async () => {
    try {
      
      const response = await createPackage(newPackage);
      setPackages([...packages, response.data]);
      setIsModalOpen(false);
      setNewPackage({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        image: '',
        includes: []
      });
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };

  const toggleProductInclusion = (productId) => {
    setNewPackage(prev => {
      const existingIndex = prev.includes.findIndex(item => item.productId === productId);
      if (existingIndex >= 0) {
        // Remove product
        return {
          ...prev,
          includes: prev.includes.filter(item => item.productId !== productId)
        };
      } else {
        // Add product with default quantity 1
        return {
          ...prev,
          includes: [...prev.includes, { productId, quantity: 1 }]
        };
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setNewPackage(prev => ({
      ...prev,
      includes: prev.includes.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Packages</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Package
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {pkg.image && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={pkg.image} alt={pkg.name} />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                      <div className="text-sm text-gray-500">{pkg.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pkg.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration} mins</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/packages/edit/${pkg._id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Package Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Package</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Name</label>
            <input
              type="text"
              value={newPackage.name}
              onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newPackage.description}
              onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={newPackage.price}
                onChange={(e) => setNewPackage({...newPackage, price: parseFloat(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={newPackage.duration}
                onChange={(e) => setNewPackage({...newPackage, duration: parseInt(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={newPackage.image}
              onChange={(e) => setNewPackage({...newPackage, image: e.target.value})}
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
                      checked={newPackage.includes.some(item => item.productId === product._id)}
                      onChange={() => toggleProductInclusion(product._id)}
                      className="mr-2"
                    />
                    <span>{product.name}</span>
                  </div>
                  {newPackage.includes.some(item => item.productId === product._id) && (
                    <input
                      type="number"
                      min="1"
                      value={newPackage.includes.find(item => item.productId === product._id)?.quantity || 1}
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
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPackage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Save Package
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}