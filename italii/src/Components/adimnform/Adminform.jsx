import { useState, useEffect } from 'react';

const AdminForm = ({
  title,
  initialData,
  onSubmit,
  onClose,
  products = []
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        image: '',
        includes: [],
        ...initialData // Spread initialData to override defaults
      });
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' 
        ? Number(value) 
        : value
    }));
  };

  const toggleProduct = (productId) => {
    setFormData(prev => {
      const exists = prev.includes.some(item => item.productId === productId);
      return {
        ...prev,
        includes: exists
          ? prev.includes.filter(item => item.productId !== productId)
          : [...prev.includes, { productId, quantity: 1 }]
      };
    });
  };

  const updateQuantity = (productId, quantity) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (mins) *
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Included Products
              </label>
              <div className="border rounded max-h-48 overflow-y-auto">
                {products.map(product => (
                  <div key={product._id} className="p-2 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.includes.some(i => i.productId === product._id)}
                          onChange={() => toggleProduct(product._id)}
                          className="mr-2"
                        />
                        <span>{product.name}</span>
                      </div>
                      {formData.includes.some(i => i.productId === product._id) && (
                        <input
                          type="number"
                          min="1"
                          value={formData.includes.find(i => i.productId === product._id)?.quantity || 1}
                          onChange={(e) => updateQuantity(product._id, parseInt(e.target.value))}
                          className="w-16 p-1 border rounded"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;